const Serial = require('./Model')

const checkerValidSerial = async (serialNumber) => {
  if (!serialNumber) throw new Error('Invalid Serial Number')

  const serial = await Serial.findOne({ serial_number: serialNumber, status: 'ACTIVE' })
  if (!serial) throw new Error('Invalid Serial Number')

  return serial
}

module.exports = {
  checkerValidSerial
}
