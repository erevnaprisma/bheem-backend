const { checkerValidQr } = require('../../../collections/qr/services')
const { checkerValidMerchant } = require('../../../collections/merchant/services')
const { addBillingService } = require('../../../collections/billing/services')
const { addUserTransaction } = require('../../../collections/transaction/services')
const { checkerValidUser } = require('../../../collections/user/services')

const scanPaymentStatic = async ({ merchantID, qrID, userID }) => {
  // 1.Extract Date for QR
  // 2. Validate Merchant
  // 3. Validate Qr
  // 4. Create Bill
  // 5. Create Trx (status pending)
  var transaction
  let billing

  try {
    // Validate Merchant ID
    await checkerValidMerchant({ MerhchantID: merchantID })

    // Validate QR Code ID
    await checkerValidQr({ QrID: qrID })

    // Validate Valid User ID
    await checkerValidUser(userID)

    // add Billing
    billing = await addBillingService()

    // add Transaction status pending
    transaction = await addUserTransaction({ userID, bill: billing.bill_id, qrID })
  } catch (err) {
    return { status: 400, error: err || 'Scan Failed' }
  }

  return { transaction_id: transaction.transaction_id, merchant_id: merchantID, billing_id: billing.bill_id, status: 200, success: 'Scan merchant success' }
}

module.exports = scanPaymentStatic
