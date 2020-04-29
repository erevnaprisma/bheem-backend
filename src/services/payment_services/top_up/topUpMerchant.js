const { addBillingMerchantService } = require('../../../collections/billing/services')
const { addUserPayment } = require('../../../collections/emoney/services')
const { addUserTransaction } = require('../../../collections/transaction/services')
const { createSaldo, updateSaldo } = require('../../../collections/saldo/services')
const { checkerValidUser, checkValidUserUsingEmail } = require('../../../collections/user/services')
const { checkerValidMerchant,  } = require('../../../collections/merchant/services')
const word = require('../../../utils/constants/word')

const User = require('../../../collections/user/Model')
const Transaction = require('../../../collections/transaction/Model')
const Saldo = require('../../../collections/saldo/Model')
const Institution = (require('../../../collections/institution/Model'))

let finalAmount
let emoney

const serviceTopUpMerchant = async (args) => {
  const { email, amount, merchant_id: merchantID } = args

  if (!email) return { status: 400, error: 'Invalid email' }
  if (!amount || args.amount <= 0) return { status: 400, error: 'Invalid amount' }
  if (!merchantID) return { status: 400, error: 'Invalid Merchant ID' }

  try {
    const user = await checkValidUserUsingEmail(email)

    // check if institution exist
    await checkerValidMerchant(merchantID)

    // create new billing
    const billing = await addBillingMerchantService(amount, merchantID)

    // create new transaction
    const transaction = await addUserTransaction({ bill: billing.bill_id, amount: args.amount, userID: user.user_id, user_id_native: user._id, transactionMethod: 'Top-up', merchantID, billing_id_native: billing._id, topup_method: 'Merchant' })

    // get saldo in saldo collection
    const getSaldoInstance = await Saldo.findOne({ user_id: user.user_id })

    // add saldo + set type to credit
    const type = 'CREDIT'

    // add e-money
    if (!getSaldoInstance) {
      emoney = await addUserPayment({ userID: user.user_id, saldo: args.amount, transactionAmount: args.amount, type })
    } else {
      finalAmount = getSaldoInstance.saldo + args.amount
      emoney = await addUserPayment({ userID: user.user_id, saldo: finalAmount, transactionAmount: args.amount, type })
    }

    // update transaction status & e-money id
    await Transaction.updateOne({ _id: transaction._id }, { status: 'SETLD', emoney_id: emoney.emoney_id, emoney_id_native: emoney._id })

    // create saldo
    if (!getSaldoInstance) {
      await createSaldo(user.user_id, args.amount)
    } else {
      await updateSaldo(getSaldoInstance.saldo_id, finalAmount)
    }

    return { status: 200, success: 'Successfully topup' }
  } catch (err) {
    return { status: 400, error: err }
  }
}

module.exports = serviceTopUpMerchant
