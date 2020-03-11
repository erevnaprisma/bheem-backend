const { getTransaction } = require('../../../collections/transaction/services')

const transactionDetail = async (transactionID) => {
  try {
    const res = await getTransaction(transactionID)
    return { status: 200, success: 'Successfully get Transaction Detail', transaction: res }
  } catch (err) {
    return { status: 400, error: err || 'Transaction Detail failed' }
  }
}

module.exports = transactionDetail
