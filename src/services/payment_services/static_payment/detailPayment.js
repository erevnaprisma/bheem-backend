const QRCode = require('qrcode')

// Services
const { getTransaction } = require('../../../collections/rp_transaction/services')

// Model
const Merchant = require('../../../collections/rp_merchant/Model')
const Qr = require('../../../collections/rp_qr/Model')

const transactionDetail = async (transactionID) => {
  try {
    const res = await getTransaction(transactionID)

    // create qr
    let createdQr
    const qr = await Qr.find()
    const selectedQr = qr.find(e => e.qr_value.transaction_id === transactionID)
    if (selectedQr) {
      createdQr = await QRCode.toDataURL(JSON.stringify(selectedQr.qr_value), { type: 'image/png' })
    } else {
      createdQr = null
    }

    const merchant = await Merchant.findOne({ merchant_id: res.merchant_id })

    res.merchant_name = merchant.business_name
    return { status: 200, success: 'Successfully get Transaction Detail', transaction: res, qr: createdQr }
  } catch (err) {
    return { status: 400, error: err.message || 'Transaction Detail failed' }
  }
}

module.exports = transactionDetail
