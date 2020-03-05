const Emoney = require('./Model')

const addUserPayment = async ({ userID, saldo, transactionAmount, type }) => {
  if (!userID) return { status: 400, error: 'Invalid user id' }
  if (!saldo) return { status: 400, error: 'Invalid saldo' }
  if (!transactionAmount) return { status: 400, error: 'Invalid transaction amount' }
  if (!type) return { status: 400, error: 'Invalid type' }

  let res = new Emoney({
    user_id: userID,
    transaction_amount: transactionAmount,
    saldo,
    type
  })

  try {
    res = await res.save()

    return res
  } catch (err) {
    return { status: 400, error: 'transaction failed' }
  }
}

const getAllPayment = () => {
  return Emoney.find()
}

module.exports.addUserPayment = addUserPayment
module.exports.getAllPayment = getAllPayment
