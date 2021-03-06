// Model
const Saldo = require('../../../collections/saldo/Model')
const Transaction = require('../../../collections/transaction/Model')
const Billing = require('../../../collections/billing/Model')
const Qr = require('../../../collections/qr/Model')
// Services
const { addUserPayment } = require('../../../collections/emoney/services')
const { checkerValidMerchant } = require('../../../collections/merchant/services')
const { checkerValidUser } = require('../../../collections/user/services')
const { checkerValidTransaction } = require('../../../collections/transaction/services')
const { checkerValidBill } = require('../../../collections/billing/services')
const { institutionRelationChecker } = require('../../../collections/institution/services')
const { checkerValidQr, isQrExpired } = require('../../../collections/qr/services')
const { getUnixTime } = require('../../../utils/services/supportServices')

let finalAmount
let getSaldoInstance

const dynamicPayment = async (merchantID, amount, userID, transactionID, password, institutionID, qrID) => {
  if (!amount || amount < 0) return { status: 400, error: 'Invalid amount' }
  if (!userID) return { status: 400, error: 'Invalid user id' }
  if (!transactionID) return { status: 400, error: 'Invalid transaction id' }

  try {
    await checkerValidMerchant(merchantID)

    // check relation between merchant and institution
    const relation = await institutionRelationChecker(merchantID, institutionID)
    if (!relation) return { status: 400, error: 'Institution and Merchant doesn\'t have relation' }

    const user = await checkerValidUser(userID)
    await checkerValidTransaction(transactionID)
    await checkerValidQr({ QrID: qrID })

    const isExpired = await isQrExpired(qrID, 180000)
    if (!isExpired) {
      await Transaction.updateOne({ transaction_id: transactionID }, { status: 'CANCEL', updated_at: getUnixTime() })
      return { status: 400, error: 'Qr already expired' }
    }

    // check password
    await user.comparedPassword(password)

    const checkerStatusTransaction = await Transaction.findOne({ transaction_id: transactionID })
    if (checkerStatusTransaction) {
      if (checkerStatusTransaction.status === 'CANCEL') {
        return { status: 400, error: 'Transaction already been canceled' }
      } else if (checkerStatusTransaction.status === 'SETLD') {
        return { status: 400, error: 'Transaction already been done' }
      }
    }

    // get current saldo
    getSaldoInstance = await Saldo.findOne({ user_id: userID })
    if (!getSaldoInstance) {
      await Transaction.updateOne({ transaction_id: transactionID }, { status: 'REJEC', updated_at: getUnixTime() })
      return { status: 400, error: 'Please top up your wallet first...' }
    }

    // subtract current saldo with amount & set emoney type
    finalAmount = getSaldoInstance.saldo - amount
    const type = 'DEBIT'

    // check if saldo is enought for payment
    if (finalAmount < 0) {
      await Transaction.updateOne({ transaction_id: transactionID }, { status: 'REJEC', updated_at: getUnixTime() })
      return { status: 400, error: 'Not enough e-money, please top up first' }
    }

    // add e-money
    const emoney = await addUserPayment({ saldo: finalAmount, transactionAmount: amount, type, userID })

    // update saldo
    await Saldo.updateOne({ saldo_id: getSaldoInstance.saldo_id }, { saldo: finalAmount, updated_at: getUnixTime() })

    // update transaction
    await Transaction.updateOne({ transaction_id: transactionID }, { status: 'SETLD', emoney: emoney.emoney_id, transaction_amount: amount, updated_at: getUnixTime() })

    await Qr.findOneAndUpdate({ qr_id: qrID }, { status: 'INACTIVE', updated_at: getUnixTime() })

    return { status: 200, success: 'Payment Success' }
  } catch (err) {
    return { status: 400, error: err || 'Payment failed' }
  }
}

module.exports = dynamicPayment
