const { addBillingService } = require('../collections/billing/services')
const { addUserPayment } = require('../collections/emoney/services')
const { addUserTransaction } = require('../collections/transaction/services')

const User = require('../collections/user/Model')
const Transaction = require('../collections/transaction/Model')

const serviceTopupVa = async (args) => {
  if (!args.user_id) return { status: 400, error: 'Invalid user id' }
  if (!args.amount || args.amount < 0) return { status: 400, error: 'Invalid amount' }

  try {
    const checkerID = await User.findOne({ _id: args.user_id })
    if (!checkerID) return { status: 400, error: 'User id not found' }

    // create new billing
    const billing = await addBillingService(args)

    // create new transaction
    const transaction = await addUserTransaction(billing.bill_id, args.amount, args.user_id)

    // find user to get current saldo
    const user = await User.findOne({ _id: args.user_id })

    // add saldo + set type to credit
    const finalAmount = user.saldo = user.saldo + args.amount
    const type = 'CREDIT'

    // add e-money
    const emoney = await addUserPayment({ userID: user._id, saldo: finalAmount, transactionAmount: args.amount, type })

    // update transaction status & e-money id
    await Transaction.updateOne({ _id: transaction._id }, { status: 'SETLD', emoney_id: emoney.emoney_id })

    // update user saldo after top up
    await User.updateOne({ _id: user._id }, { saldo: finalAmount })

    return { status: 200, success: 'Successfully topup' }
  } catch (err) {
    return { status: 400, error: err }
  }
}

module.exports.serviceTopupVa = serviceTopupVa
