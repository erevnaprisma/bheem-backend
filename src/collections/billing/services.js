const Billing = require('./Model')

const addBillingService = async (args) => {
  const { error } = Billing.validation(args)
  if (error) return { status: 400, error: error.details[0].message }

  if (!args.amount) return { status: 400, error: 'Invalid amount' }

  try {
    let bill = await new Billing({
      amount: args.amount
    })
    bill = await bill.save()

    return bill
  } catch (err) {
    return { status: 400, error: err }
  }
}

module.exports.addBillingService = addBillingService
