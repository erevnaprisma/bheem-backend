const { getTransaction } = require('../../../collections/transaction/services')

const transactionReceipt = async (transactionID) => {
  try {
    const res = await getTransaction(transactionID)
    return { status: 200, success: 'Successfully get Receipt', transaction: res }
  } catch (err) {
    return { status: 400, error: err || 'Transaction Receipt failed' }
  }
}

module.exports = transactionReceipt
