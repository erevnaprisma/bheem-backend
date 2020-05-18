// Model
const Saldo = require('../../../../collections/saldo/Model')
const Transaction = require('../../../../collections/transaction/Model')
const Qr = require('../../../../collections/qr/Model')
const Serial = require('../../../../collections/serial_numbers/Model')

// Services
const { getUnixTime, generateID } = require('../../../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../../../utils/constants/number')
const { checkerValidUser } = require('../../../../collections/user/services')
const { createTopUpSettlementViaMerchant } = require('../.../../../../../collections/settlement/services')

const paymentTopUpMerchantService = async (userID, amount, qrID, transactionID, serialID, merchantID, institutionID) => {
  try {
    const user = await checkerValidUser(userID)

    const serial = await Serial.findOne({ serial_id: serialID })

    // Update User saldo
    let finalSaldo = 0
    const currentSaldo = await Saldo.findOne({ user_id: userID })
    // if already top up before
    if (currentSaldo) {
      finalSaldo = currentSaldo.saldo + amount
      await Saldo.updateOne({ user_id: userID }, { saldo: finalSaldo })
    } else {
      const saldo = await new Saldo({
        saldo_id: generateID(RANDOM_STRING_FOR_CONCAT),
        saldo: amount,
        user_id: userID,
        user_id_native: user._id,
        created_at: getUnixTime(),
        updated_at: getUnixTime()
      })

      await saldo.save()
    }
    // Update Transaction to Settled
    await Transaction.updateOne({ transaction_id: transactionID }, { status: 'SETLD', user_id: userID, user_id_native: user._id })

    // Inactive Qr Code
    await Qr.updateOne({ qr_id: qrID }, { status: 'INACTIVE' })

    // Inactive Serial Number
    await Serial.updateOne({ serial_id: serial.serial_id }, { status: 'INACTIVE' })

    await createTopUpSettlementViaMerchant(merchantID, transactionID, amount, institutionID)

    return { status: 200, success: 'Transaction Success' }
  } catch (err) {
    return { status: 400, error: 'Failed Confirm Payment' }
  }
}

module.exports = paymentTopUpMerchantService
