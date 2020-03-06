const Qr = require('./Model')
const { generateID, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const addQr = async () => {
  let qr = new Qr({
    qr_id: generateID(RANDOM_STRING_FOR_CONCAT),
    created_at: getUnixTime(),
    updated_at: getUnixTime()
  })

  qr = await qr.save()

  return qr
}

module.exports.addQr = addQr
