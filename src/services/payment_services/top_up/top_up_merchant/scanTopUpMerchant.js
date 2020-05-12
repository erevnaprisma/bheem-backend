// Services
const { checkerValidMerchant } = require('../../../../collections/merchant/services')
const { checkerValidSerial } = require('../../../../collections/serial_numbers/services')
const { checkerValidQr, isQrExpired } = require('../../../../collections/qr/services')
const { checkerValidUser } = require('../../../../collections/user/services')
const { generateID, getUnixTime } = require('../../../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../../../utils/constants/number')

// Model
const Saldo = require('../../../../collections/saldo/Model')
const Transaction = require('../../../../collections/transaction/Model')
const Qr = require('../../../../collections/qr/Model')
const Serial = require('../../../../collections/serial_numbers/Model')

const scanQrTopupMerchant = async (amount, merchantID, serialNumber, userID, transactionID, qrID, serialID) => {
  try {
    // Check Valid User
    const user = await checkerValidUser(userID)

    // Validate Merchant ID
    await checkerValidMerchant(merchantID)

    // Check if Serial Number is Valid
    const serial = await checkerValidSerial(serialID, serialNumber)

    // Check if Qr ID valid
    await checkerValidQr({ QrID: qrID })

    // Check if Qr already expired
    // const isExpired = await isQrExpired(qrID, 180000)
    // if (!isExpired) {
    //   // if Qr expired then change transaction and serial status
    //   await Transaction.updateOne({ transaction_id: transactionID }, { status: 'CANCEL' })
    //   await Serial.updateOne({ serial_id: serial.serial_id }, { status: 'INACTIVE' })
    //   return { status: 400, error: 'Qr already expired' }
    // }

    // Update User saldo
    let finalSaldo = 0
    const currentSaldo = await Saldo.findOne({ user_id: userID })

    // if already top up before
    if (currentSaldo) {
      finalSaldo = currentSaldo.saldo + amount
      await Saldo.updateOne({ user_id: userID }, { saldo: finalSaldo })
    } else {
      await new Saldo({
        saldo_id: generateID(RANDOM_STRING_FOR_CONCAT),
        saldo: amount,
        user_id: userID,
        user_id_native: user._id,
        created_at: getUnixTime(),
        updated_at: getUnixTime()
      })
    }

    // Update Transaction to Settled
    await Transaction.updateOne({ transaction_id: transactionID }, { status: 'SETLD', user_id: userID, user_id_native: user._id })

    // Inactive Qr Code
    await Qr.updateOne({ qr_id: qrID }, { status: 'INACTIVE' })

    // Inactive Serial Number
    await Serial.updateOne({ serial_id: serial.serial_id }, { status: 'INACTIVE' })

    return { status: 200, success: 'Successfully Top Up' }
  } catch (err) {
    return { status: 400, error: err || 'Failed Scan for Top up' }
  }
}

module.exports = scanQrTopupMerchant
