const { checkerValidQr, isQrExpired } = require('../../../collections/rp_qr/services')
const { checkerValidMerchant } = require('../../../collections/rp_merchant/services')
const { checkerValidTransaction } = require('../../../collections/rp_transaction/services')
const { checkerValidBill } = require('../../../collections/rp_billing/services')
const { checkerValidUser } = require('../../../collections/user/services')
const { institutionRelationChecker } = require('../../../collections/rp_institution/services')
const { getUnixTime } = require('../../../utils/services/supportServices')

const Merchant = require('../../../collections/rp_merchant/Model')
const Qr = require('../../../collections/rp_qr/Model')
const Transaction = require('../../../collections/rp_transaction/Model')

const scanPaymentDynamic = async ({ merchantID, qrID, institutionID = '1588133477369IntRx', transaction_id: transactionID, amount, userID }) => {
  // 1. Extract Date for QR
  // 2. Validate Merchant
  // 3. Validate Qr
  // 4. Create Bill
  // 5. Create Trx (status pending)
  var transaction

  try {
    // Validate Merchant ID
    const merchant = await checkerValidMerchant(merchantID)

    // Validate User ID
    const user = await checkerValidUser(userID)

    // Validate QR Code ID
    await checkerValidQr({ QrID: qrID })

    // Check Qr expire date
    const isExpired = await isQrExpired(qrID, 180000)
    if (!isExpired) {
      await Transaction.updateOne({ transaction_id: transactionID }, { status: 'CANCEL', updated_at: getUnixTime() })
      return { status: 400, error: 'Qr already Expired' }
    }

    // Validate Transaction ID
    await checkerValidTransaction(transactionID)

    // check relation between merchant and institution
    const relation = await institutionRelationChecker(merchantID, institutionID)
    if (!relation) {
      await Qr.updateOne({ qr_id: qrID }, { status: 'INACTIVE', updated_at: getUnixTime() })
      return { status: 400, error: 'Institution and Merchant doesn\'t have relation' }
    }

    // Update transaction adding user id
    await Transaction.updateOne({ transaction_id: transactionID }, { user_id: userID, user_id_native: user._id, updated_at: getUnixTime() })

    return { transaction_id: transactionID, merchant_id: merchantID, status: 200, success: 'Scan merchant success', merchant_name: merchant.business_name, institution_id: institutionID, amount, qr_id: qrID }
  } catch (err) {
    return { status: 400, error: err || 'Scan Failed' }
  }
}

module.exports = scanPaymentDynamic
