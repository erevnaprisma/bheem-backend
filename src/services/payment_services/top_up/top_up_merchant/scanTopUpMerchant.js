// Services
const { checkerValidMerchant } = require('../../../../collections/rp_merchant/services')
const { checkerValidInstitution } = require('../../../../collections/rp_institution/services')
const { checkerValidSerial } = require('../../../../collections/rp_serial_numbers/services')
const { checkerValidQr, isQrExpired } = require('../../../../collections/rp_qr/services')
const { checkerValidUser } = require('../../../../collections/user/services')
const { checkerValidTransaction } = require('../../../../collections/rp_transaction/services')
const { generateID, getUnixTime } = require('../../../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../../../utils/constants/number')

// Model
const Saldo = require('../../../../collections/rp_saldo/Model')
const Transaction = require('../../../../collections/rp_transaction/Model')
const Qr = require('../../../../collections/rp_qr/Model')
const Serial = require('../../../../collections/rp_serial_numbers/Model')

const scanQrTopupMerchant = async (amount, merchantID, serialNumber, userID, transactionID, qrID, serialID) => {
  try {
    // Check Valid User
    await checkerValidUser(userID)

    // Validate Merchant ID
    await checkerValidMerchant(merchantID)

    // Check if Serial Number is Valid
    const serial = await checkerValidSerial(serialID, serialNumber)

    // Check if Qr ID valid
    await checkerValidQr({ QrID: qrID })

    // Check if Transaction ID valid
    await checkerValidTransaction(transactionID)

    // Check if Qr already expired
    const isExpired = await isQrExpired(qrID, 180000)
    if (!isExpired) {
      // if Qr expired then change transaction, serial, and qr
      await Transaction.updateOne({ transaction_id: transactionID }, { status: 'CANCEL', updated_at: getUnixTime() })
      await Serial.updateOne({ serial_id: serial.serial_id }, { status: 'INACTIVE', updated_at: getUnixTime() })
      await Qr.updateOne({ qr_id: qrID }, { status: 'INACTIVE', updated_at: getUnixTime() })
      return { status: 400, error: 'Qr already expired' }
    }

    // // Update User saldo
    // let finalSaldo = 0
    // const currentSaldo = await Saldo.findOne({ user_id: userID })
    // // if already top up before
    // if (currentSaldo) {
    //   finalSaldo = currentSaldo.saldo + amount
    //   await Saldo.updateOne({ user_id: userID }, { saldo: finalSaldo })
    // } else {
    //   const saldo = await new Saldo({
    //     saldo_id: generateID(RANDOM_STRING_FOR_CONCAT),
    //     saldo: amount,
    //     user_id: userID,
    //     user_id_native: user._id,
    //     created_at: getUnixTime(),
    //     updated_at: getUnixTime()
    //   })

    //   await saldo.save()
    // }

    // // Update Transaction to Settled
    // await Transaction.updateOne({ transaction_id: transactionID }, { status: 'SETLD', user_id: userID, user_id_native: user._id })

    // // Inactive Qr Code
    // await Qr.updateOne({ qr_id: qrID }, { status: 'INACTIVE' })

    // // Inactive Serial Number
    // await Serial.updateOne({ serial_id: serial.serial_id }, { status: 'INACTIVE' })

    return { status: 200, success: 'Successfully Scan Qr' }
  } catch (err) {
    return { status: 400, error: err || 'Failed Scan for Top up' }
  }
}

module.exports = scanQrTopupMerchant
