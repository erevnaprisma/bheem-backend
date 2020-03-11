const Emoney = require('./Model')
const { generateID, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const addUserPayment = async ({ userID, saldo, transactionAmount, type }) => {
  const { error } = Emoney.validation({ user_id: userID, saldo, transaction_amount: transactionAmount, type })
  if (error) return { status: 400, error: error.details[0].message }

  const res = new Emoney({
    user_id: userID,
    transaction_amount: transactionAmount,
    saldo,
    type,
    emoney_id: generateID(RANDOM_STRING_FOR_CONCAT),
    created_at: getUnixTime(),
    updated_at: getUnixTime()
  })
  try {
    return res.save().catch((err) => console.log(err._message))
  } catch (err) {
    return { status: 400, error: err || 'transaction failed' }
  }
}

const getAllPayment = () => {
  return Emoney.find()
}

module.exports.addUserPayment = addUserPayment
module.exports.getAllPayment = getAllPayment
