const QRCode = require('qrcode')
const Qr = require('./Model')
const Merchant = require('../merchant/Model')
const Institution = require('../institution/Model')
const { generateID, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')
const { checkerValidMerchant } = require('../merchant/services')
const { checkerValidInstitution, institutionRelationChecker } = require('../institution/services')

const createQrStaticService = async (merchantID, context) => {
  const type = 'STATIC'
  const status = 'ACTIVE'

  // static prisma institution id
  const institutionID = '1587036707463uIQYe'

  try {
    // check if merchant id valid
    await checkerValidMerchant(merchantID)

    // check if institution id valid
    await checkerValidInstitution(institutionID)

    // get native _id 
    const { _id: institutionIdNative } = await Institution.findOne({ institution_id: institutionID })

    // check relation between merchant and institution
    const relation = await institutionRelationChecker(merchantID, institutionID)
    if (!relation) return { status: 400, error: 'Institution and Merchant doesn\'t have relation' }

    const qr = new Qr({
      qr_id: generateID(RANDOM_STRING_FOR_CONCAT),
      created_at: getUnixTime(),
      updated_at: getUnixTime(),
      type,
      status,
      merchant_id: merchantID
    })

    const { business_name: businessName, _id: merchantIdNative } = await Merchant.findOne({ merchant_id: merchantID })

    // create a png qrcode
    const qrCode = await generateQrPng({ merchantID: merchantID, merchantName: businessName, qrID: qr.qr_id, type: qr.type, institutionID })

    // save created qrcode to collection
    qr.qr_value = { merchantIdNative, merchant_id: merchantID, merchant_name: businessName, qr_id: qr.qr_id, type: qr.type, institution_id: institutionID, institution_id_native: institutionIdNative }

    await qr.save()

    return { status: 200, error: 'Successfully creating QR Code', qr_code: qrCode }
  } catch (err) {
    return { status: 400, error: err || 'Failed create QR Code' }
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

  const res = await Qr.findOne({ qr_id: QrID, status: 'ACTIVE' })
  if (!res) throw new Error('Invalid QR Code')
}

const generateQrPng = async ({ merchantID, merchantName, qrID, type, institutionID }) => {
  // const a = await QRCode.image(merchantID, { type: 'png', size: 10, margin: 0 })
  // console.log('a=', JSON.stringify(a))
  // return JSON.stringify(a)
  const a = await QRCode.toDataURL(JSON.stringify({ merchant_id: merchantID, qr_id: qrID, type: type, merchant_name: merchantName, institution_id: institutionID }), { type: 'image/png' })
  return a
}

const showQrService = async (merchantID) => {
  await checkerValidMerchant(merchantID)

  try {
    const { qr_value } = await Qr.findOne({ merchant_id: merchantID, status: 'ACTIVE' })

    const qrCode = await generateQrPng({ merchantID: qr_value.merchant_id, qrID: qr_value.qr_id, type: qr_value.type, merchantName: qr_value.merchant_name })

    return { status: 200, success: 'Successfully get QrCode', qr_code: qrCode }
  } catch (err) {
    return { status: 400, error: err || 'Show Qr Failed' }
  }
}

module.exports.createQrDynamic = createQrDynamic
module.exports.createQrStaticService = createQrStaticService
module.exports.checkerValidQr = checkerValidQr
module.exports.showQrService = showQrService
