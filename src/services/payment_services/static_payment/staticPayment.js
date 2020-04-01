/*
1. Create Bill
2. Create Transaction
3. Create Emoney with type Debit
4. Update Transaction
*/
// Model
const Saldo = require('../../../collections/saldo/Model')
const Transaction = require('../../../collections/transaction/Model')
const Billing = require('../../../collections/billing/Model')
// Services
const { addUserPayment } = require('../../../collections/emoney/services')
const { checkerValidMerchant } = require('../../../collections/merchant/services')
const { checkerValidUser } = require('../../../collections/user/services')
const { checkerValidTransaction } = require('../../../collections/transaction/services')
const { checkerValidBill } = require('../../../collections/billing/services')

let finalAmount
let getSaldoInstance

const staticPayment = async (merchantID, amount, userID, transactionID, billID, password) => {
  if (!amount || amount < 0) return { status: 400, error: 'Invalid amount' }
  if (!userID) return { status: 400, error: 'Invalid user id' }
  if (!transactionID) return { status: 400, error: 'Invalid transaction id' }

  await checkerValidMerchant(merchantID)
  const user = await checkerValidUser(userID)
  await checkerValidTransaction(transactionID)
  await checkerValidBill(billID)

  try {
    const checkerStatusTransaction = await Transaction.findOne({ transaction_id: transactionID })
    if (checkerStatusTransaction) {
      if (checkerStatusTransaction.status === 'CANCEL') {
        return { status: 400, error: 'Transaction already been canceled' }
      }
    }

    // get current saldo
    getSaldoInstance = await Saldo.findOne({ user_id: userID })
    if (!getSaldoInstance) {
      await Transaction.updateOne({ transaction_id: transactionID }, { status: 'REJEC' })
      return { status: 400, error: 'Please top up your wallet first...' }
    }

    // subtract current saldo with amount & set emoney type
    finalAmount = getSaldoInstance.saldo - amount
    const type = 'DEBIT'

    // check if saldo is enought for payment
    if (finalAmount < 0) {
      await Transaction.updateOne({ transaction_id: transactionID }, { status: 'REJEC' })
      return { status: 400, error: 'Please top up your wallet first...' }
    }

    // check password
    await user.comparedPassword(password)

    // add e-money
    const emoney = await addUserPayment({ saldo: finalAmount, transactionAmount: amount, type, userID })

    // update saldo
    await Saldo.updateOne({ saldo_id: getSaldoInstance.saldo_id }, { saldo: finalAmount })

    // update billing amount
    await Billing.updateOne({ bill_id: billID }, { amount })

    // update transaction
    await Transaction.updateOne({ transaction_id: transactionID }, { status: 'SETLD', emoney: emoney.emoney_id, transaction_amount: amount })

    return { status: 200, success: 'Payment Success' }
  } catch (err) {
    return { status: 400, error: err || 'Payment failed' }
  }
}

module.exports = staticPayment
