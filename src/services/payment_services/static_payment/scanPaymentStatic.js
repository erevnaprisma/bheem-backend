const { checkerValidQr } = require('../../../collections/qr/services')
const { checkerValidMerchant } = require('../../../collections/merchant/services')
const { addBillingService } = require('../../../collections/billing/services')
const { addUserTransaction } = require('../../../collections/transaction/services')
const { checkerValidUser } = require('../../../collections/user/services')
const { institutionRelationChecker } = require('../../../collections/institution/services')

const Merchant = require('../../../collections/merchant/Model')
const Qr = require('../../../collections/qr/Model')

const scanPaymentStatic = async ({ merchantID, qrID, userID, institutionID }) => {
  // 1. Extract Date for QR
  // 2. Validate Merchant
  // 3. Validate Qr
  // 4. Create Bill
  // 5. Create Trx (status pending)
  var transaction
  let billing

  try {
    // Validate Merchant ID
    await checkerValidMerchant(merchantID)

    // Validate QR Code ID
    await checkerValidQr({ QrID: qrID })

    // check relation between merchant and institution
    const relation = await institutionRelationChecker(merchantID, institutionID)
    if (!relation) {
      await Qr.updateOne({ qr_id: qrID }, { status: 'INACTIVE' })
      return { status: 400, error: 'Institution and Merchant doesn\'t have relation' }
    }

    // Validate Valid User ID
    await checkerValidUser(userID)

    // add Billing
    billing = await addBillingService()

    // get merchant name
    const merchant = await Merchant.findOne({ merchant_id: merchantID })

    // add Transaction status pending
    transaction = await addUserTransaction({ userID, bill: billing.bill_id, qrID, merchantID, transactionMethod: 'E-money' })

    return { transaction_id: transaction.transaction_id, merchant_id: merchantID, billing_id: billing.bill_id, status: 200, success: 'Scan merchant success', merchant_name: merchant.username }
  } catch (err) {
    return { status: 400, error: err || 'Scan Failed' }
  }
}

module.exports = scanPaymentStatic
