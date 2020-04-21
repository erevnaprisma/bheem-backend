const { addBillingService } = require('../../collections/billing/services')
const { addUserTransaction } = require('../../collections/transaction/services')
const { addUserPayment } = require('../../collections/emoney/services')

const Transaction = require('../../collections/transaction/Model')

// const userDynamicPayment = async () => {
// }

const merchantDynamicPayment = async (amount) => {
  if (!amount || amount < 0) return { status: 400, error: 'Invalid amount' }

  try {
    // add billing
    const billing = await addBillingService({ amount })

    // add transaction with status pending
    const transaction = await addUserTransaction({ amount, bill: billing.bill_id })

    return { status: 200, success: 'Transaction created, waiting for payment' }
  } catch (err) {
    return { status: 400, success: err || 'Create transactino failed' }
  }
}

module.exports.merchantDynamicPayment = merchantDynamicPayment
