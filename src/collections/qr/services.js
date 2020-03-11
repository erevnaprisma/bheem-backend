const Qr = require('./Model')
const { generateID, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const createQrStaticService = async (merchantID) => {
  const type = 'STATIC'
  const status = 'ACTIVE'

  try {
    const qr = new Qr({
      qr_id: generateID(RANDOM_STRING_FOR_CONCAT),
      created_at: getUnixTime(),
      updated_at: getUnixTime(),
      type,
      status,
      merchant_id: merchantID
    })

    await qr.save()

    return { status: 200, error: 'Successfully creating QR Code' }
  } catch (err) {
    return { status: 400, error: err }
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

module.exports.createQrDynamic = createQrDynamic
module.exports.createQrStaticService = createQrStaticService
module.exports.checkerValidQr = checkerValidQr
