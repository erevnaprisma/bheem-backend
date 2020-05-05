const { getTransaction } = require('../../../collections/transaction/services')

const Merchant = require('../../../collections/merchant/Model')

const transactionReceipt = async (transactionID) => {
  try {
    const res = await getTransaction(transactionID)

    const merchant = await Merchant.findOneAndUpdate({ merchant_id: res.merchant_id })

    res.merchant_name = merchant.business_name

    return { status: 200, success: 'Successfully get Receipt', transaction: res }
  } catch (err) {
    return { status: 400, error: err || 'Transaction Receipt failed' }
  }
}

module.exports = transactionReceipt
