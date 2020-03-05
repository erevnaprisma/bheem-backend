const Saldo = require('./Model')

const createSaldo = async (userID, finalAmount) => {
  if (!userID) return { status: 400, error: 'Invalid user id' }
  else if (!finalAmount) return { status: 400, error: 'Invalid final amount' }

  const saldo = new Saldo({
    user_id: userID,
    saldo: finalAmount
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
