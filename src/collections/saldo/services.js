const Saldo = require('./Model')
const { generateID, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const createSaldo = async (userID, finalAmount) => {
  const { error } = Saldo.validation({ user_id: userID, saldo: finalAmount })
  if (error) return { status: 400, error: error.details[0].message }

  const saldo = new Saldo({
    user_id: userID,
    saldo: finalAmount,
    saldo_id: generateID(RANDOM_STRING_FOR_CONCAT),
    created_at: getUnixTime(),
    updated_at: getUnixTime()
  })
  saldo.save()
  return saldo
}

const updateSaldo = async (saldoID, finalAmount) => {
  if (!saldoID) return { status: 400, error: 'Invalid saldo id' }
  else if (!finalAmount) return { status: 400, error: 'Invalid final amount' }

  await Saldo.updateOne({ saldo_id: saldoID }, { saldo: finalAmount })
}

module.exports.createSaldo = createSaldo
module.exports.updateSaldo = updateSaldo
