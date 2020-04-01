const QRCode = require('qrcode')
const Qr = require('./Model')
const Merchant = require('../merchant/Model')
const { generateID, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')
const { checkerValidMerchant } = require('../merchant/services')

const createQrStaticService = async (merchantID, context) => {
  const type = 'STATIC'
  const status = 'ACTIVE'

  await checkerValidMerchant(merchantID)

  try {
    const qr = new Qr({
      qr_id: generateID(RANDOM_STRING_FOR_CONCAT),
      created_at: getUnixTime(),
      updated_at: getUnixTime(),
      type,
      status,
      merchant_id: merchantID
    })

    const { username } = await Merchant.findOne({ merchant_id: merchantID }).select('username -_id')

    // create a png qrcode
    const qrCode = await generateQrPng({ merchantID: merchantID, merchantName: username, qrID: qr.qr_id, type: qr.type })

    // save created qrcode to collection
    qr.qr_value = { merchant_id: merchantID, merchant_name: username, qr_ID: qr.qr_id, type: qr.type }

    await qr.save()

    return { status: 200, error: 'Successfully creating QR Code', qr_code: qrCode }
  } catch (err) {
    return { status: 400, error: 'Failed create QR Code' }
  }
}

const createQrDynamic = async (type, status, transactionID) => {
  let qr = new Qr({
    qr_id: generateID(RANDOM_STRING_FOR_CONCAT),
    created_at: getUnixTime(),
    updated_at: getUnixTime(),
    type,
    status,
    transaction_id: transactionID
  })

  qr = await qr.save()

  return qr
}

const checkerValidQr = async ({ QrID }) => {
  if (!QrID) throw new Error('Invalid QR Code')

  const res = await Qr.findOne({ qr_id: QrID })
  if (!res) throw new Error('Invalid QR Code')
}

const generateQrPng = async ({ merchantID, merchantName, qrID, type }) => {
  // const a = await QRCode.image(merchantID, { type: 'png', size: 10, margin: 0 })
  // console.log('a=', JSON.stringify(a))
  // return JSON.stringify(a)
  const a = await QRCode.toDataURL(merchantName, { type: 'image/png' })
  return a
}

module.exports.createQrDynamic = createQrDynamic
module.exports.createQrStaticService = createQrStaticService
module.exports.checkerValidQr = checkerValidQr
