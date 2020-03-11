const { addBillingService } = require('../../collections/billing/services')
const { addUserPayment } = require('../../collections/emoney/services')
const { addUserTransaction } = require('../../collections/transaction/services')
const { createSaldo, updateSaldo } = require('../../collections/saldo/services')

const User = require('../../collections/user/Model')
const Transaction = require('../../collections/transaction/Model')
const Saldo = require('../../collections/saldo/Model')

let finalAmount
let emoney

const serviceTopupVa = async (args) => {
  if (!args.user_id) return { status: 400, error: 'Invalid user id' }
  if (!args.amount || args.amount <= 0) return { status: 400, error: 'Invalid amount' }

  try {
    const checkerID = await User.findOne({ user_id: args.user_id })
    if (!checkerID) return { status: 400, error: 'User id not found' }

    // create new billing
    const billing = await addBillingService(args.amount)

    // create new transaction
    const transaction = await addUserTransaction({ bill: billing.bill_id, amount: args.amount, userID: args.user_id })

    // get saldo in saldo collection
    const getSaldoInstance = await Saldo.findOne({ user_id: args.user_id })

    // add saldo + set type to credit
    const type = 'CREDIT'

    // add e-money
    if (!getSaldoInstance) {
      emoney = await addUserPayment({ userID: args.user_id, saldo: args.amount, transactionAmount: args.amount, type })
    } else {
      finalAmount = getSaldoInstance.saldo + args.amount
      emoney = await addUserPayment({ userID: args.user_id, saldo: finalAmount, transactionAmount: args.amount, type })
    }

    // update transaction status & e-money id
    await Transaction.updateOne({ _id: transaction._id }, { status: 'SETLD', emoney_id: emoney.emoney_id })

    // create saldo
    if (!getSaldoInstance) {
      await createSaldo(args.user_id, args.amount)
    } else {
      await updateSaldo(getSaldoInstance.saldo_id, finalAmount)
    }

    return { status: 200, success: 'Successfully topup' }
  } catch (err) {
    return { status: 400, error: err }
  }
}

module.exports = serviceTopupVa
