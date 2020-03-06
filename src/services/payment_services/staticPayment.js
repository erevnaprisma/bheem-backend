/*
1. Create Bill
2. Create Transaction
3. Create Emoney with type Debit
4. Update Transaction
*/

const Saldo = require('../../collections/saldo/Model')
const Transaction = require('../../collections/transaction/Model')

const { addBillingService } = require('../../collections/billing/services')
const { addUserTransaction } = require('../../collections/transaction/services')
const { addUserPayment } = require('../../collections/emoney/services')

let finalAmount
let getSaldoInstance

const staticPayment = async (merchantID, amount, userID) => {
  if (!merchantID) return { status: 400, error: 'Invalid merchant id' }
  if (!amount) return { status: 400, error: 'Invalid merchant id' }
  if (!userID) return { status: 400, error: 'Invalid merchant id' }

  try {
    // add Billing
    const billing = await addBillingService(amount)

    // add Transaction type pending
    const transaction = await addUserTransaction({ amount, userID, bill: billing.bill_id })

    // get current saldo
    getSaldoInstance = await Saldo.findOne({ user_id: userID })
    if (!getSaldoInstance) {
      await Transaction.updateOne({ transaction_id: transaction.transaction_id }, { status: 'REJEC' })
      return { status: 400, error: 'Please top up your wallet first...' }
    }

    // subtract current saldo with amount & set emoney type
    finalAmount = getSaldoInstance.saldo - amount
    const type = 'DEBIT'

    // check if saldo is enought for payment
    if (finalAmount < 0) {
      await Transaction.updateOne({ transaction_id: transaction.transaction_id }, { status: 'REJEC' })
      return { status: 400, error: 'Please top up your wallet first...' }
    }

    // add e-money
    const emoney = await addUserPayment({ saldo: finalAmount, transactionAmount: amount, type, userID })

    // update saldo
    await Saldo.updateOne({ saldo_id: getSaldoInstance.saldo_id }, { saldo: finalAmount })

    // update transaction
    await Transaction.updateOne({ transaction_id: transaction.transaction_id }, { status: 'SETLD', emoney: emoney.emoney_id })

    return { status: 200, success: 'Payment Success' }
  } catch (err) {
    return { status: 400, success: err | 'Payment failed'}
  }
}

module.exports = staticPayment
