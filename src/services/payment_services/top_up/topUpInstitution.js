const { addBillingService } = require('../../../collections/rp_billing/services')
const { addUserPayment } = require('../../../collections/rp_emoney/services')
const { addUserTransaction } = require('../../../collections/rp_transaction/services')
const { createSaldo, updateSaldo } = require('../../../collections/rp_saldo/services')
const { checkerValidUser, checkValidUserUsingEmail } = require('../../../collections/user/services')
const { checkerValidInstitution } = require('../../../collections/rp_institution/services')
const { createTopUpSettlementViaInstitution } = require('../../../collections/rp_settlement/services')
const { getUnixTime } = require('../../../utils/services/supportServices')
const word = require('../../../utils/constants/word')

const User = require('../../../collections/user/Model')
const Transaction = require('../../../collections/rp_transaction/Model')
const Saldo = require('../../../collections/rp_saldo/Model')
const Institution = (require('../../../collections/rp_institution/Model'))

let finalAmount
let emoney

const serviceTopUpInstitution = async (args) => {
  if (!args.email) return { status: 400, error: 'Invalid email' }
  if (!args.amount || args.amount <= 0) return { status: 400, error: 'Invalid amount' }
  if (!args.institution_id) return { status: 400, error: 'Invalid Institution ID' }

  try {
    const user = await checkValidUserUsingEmail(args.email)

    // check if institution exist
    await checkerValidInstitution(args.institution_id)

    // create new billing
    const billing = await addBillingService({ amount: args.amount, institution_id: args.institution_id })

    // create new transaction
    const transaction = await addUserTransaction({ bill: billing.bill_id, amount: args.amount, userID: user.user_id, user_id_native: user._id, transactionMethod: 'Top-up', institutionID: args.institution_id, billing_id_native: billing._id, topup_method: 'Institution' })

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
    await Transaction.updateOne({ _id: transaction._id }, { status: 'SETLD', emoney_id: emoney.emoney_id, emoney_id_native: emoney._id, updated_at: getUnixTime() })

    // create saldo
    if (!getSaldoInstance) {
      await createSaldo(user.user_id, args.amount)
    } else {
      await updateSaldo(getSaldoInstance.saldo_id, finalAmount)
    }

    await createTopUpSettlementViaInstitution(transaction.transaction_id, args.amount, args.institution_id)

    return { status: 200, success: 'Successfully topup' }
  } catch (err) {
    return { status: 400, error: err }
  }
}

module.exports = serviceTopUpInstitution
