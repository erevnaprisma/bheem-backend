const Saldo = require('./Model')

const createSaldo = async (userID, finalAmount) => {
  const saldo = new Saldo({
    user_id: userID,
    saldo: finalAmount
  })
  saldo.save()
  return saldo
}

const updateSaldo = async (saldoID, finalAmount) => {
  await Saldo.updateOne({ saldo_id: saldoID }, { saldo: finalAmount })
}

module.exports.createSaldo = createSaldo
module.exports.updateSaldo = updateSaldo
