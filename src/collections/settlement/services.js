const Transaction = require('../transaction/Model')

const setSettlementService = async (transactions) => {
  try {
    transactions.forEach(async e => {
      await Transaction.updateOne({ transaction_id: e }, { isSettlement: 'Y' })
    })

    return { status: 200, success: 'Successfully Change Settlement', transaction: transactions }
  } catch (err) {
    return { status: 400, error: 'Failed Change Settlement' }
  }
}

module.exports = {
  setSettlementService
}
