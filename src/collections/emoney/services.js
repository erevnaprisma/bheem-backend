const Emoney = require('./Model')

const addUserPayment = async (args) => {
  if (!args.user_id || !args.transaction_id || !args.bill_id || !args.transaction_amount || !args.saldo || !args.type) return { status: 400, error: 'Field cannot be empty' }

  const res = await new Emoney({
    user_id: args.user_id,
    transaction_id: args.transaction_id,
    bill_id: args.bill_id,
    transaction_amount: args.transaction_amount,
    saldo: args.saldo,
    type: args.type
  })

  switch (args.type) {
    case 'DEBIT':
      res.saldo = 10
      break
    case 'CREDIT':
      res.saldo = 20
      break
    default:
      return { status: 400, error: 'Type not found' }
  }

  try {
    res.save()

    return { status: 200, success: 'transaction success' }
  } catch (err) {
    return { status: 400, error: 'transaction failed' }
  }
}

const getAllPayment = () => {
  return Emoney.find()
}

module.exports.addUserPayment = addUserPayment
module.exports.getAllPayment = getAllPayment
