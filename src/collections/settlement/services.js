// Model
const Transaction = require('../transaction/Model')
const Merchant = require('../merchant/Model')
const Fee = require('../fee/Model')
const Settlement = require('../settlement/Model')
const Institution = require('../institution/Model')

// Services
const { generateID, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const setSettlementService = async (transactions) => {
  try {
    transactions.forEach(async e => {
      await Transaction.updateOne({ transaction_id: e }, { isSettlement: 'Y' })
    })

    return { status: 200, success: 'Successfully Change Settlement', transaction: transactions }
  } catch (err) {
    return { status: 400, error: 'Failed Change Settlement' }
  }
}

const createPaymentSettlement = async (merchantID, transactionID, amount, institutionID) => {
  try {
    // get merchant _id
    const merchant = await Merchant.findOne({ merchant_id: merchantID })

    // get transaction _id
    const transaction = await Transaction.findOne({ transaction_id: transactionID })

    // get institution _id
    const institution = await Institution.findOne({ institution_id: institutionID })

    const operatorCode = merchant.fee_master_code.operator_code_emoney
    const operatorFee = await Fee.findOne({ fee_master_code: operatorCode })

    const institutionCode = merchant.fee_master_code.institution_code_emoney
    const institutionFee = await Fee.findOne({ fee_master_code: institutionCode })

    const institutionCalc = calculateFee(amount, institutionFee)

    // settlement for institution
    const institutionSettlement = await new Settlement({
      settlement_id: generateID(RANDOM_STRING_FOR_CONCAT),
      institution_id: institutionID,
      institution_id_native: institution._id,
      transaction_id: transactionID,
      transaction_id_native: transaction._id,
      payment_date: transaction.created_at,
      status: 'PNDNG',
      created_at: getUnixTime(),
      updated_at: getUnixTime(),
      transaction_amount: transaction.transaction_amount,
      action_to: 'institution',
      action_from: 'operator',
      percentage_fee: institutionCalc.percentageFee,
      fix_fee: institutionCalc.fixFee,
      total_fee: institutionCalc.totalFee
      // settlement_amount: institutionCalc.settlementAmount
    })

    const operatorCalc = calculateFee(amount, operatorFee)

    // settlement for operator
    const operatorSettlement = await new Settlement({
      settlement_id: generateID(RANDOM_STRING_FOR_CONCAT),
      transaction_id: transactionID,
      transaction_id_native: transaction._id,
      payment_date: transaction.created_at,
      status: 'PNDNG',
      created_at: getUnixTime(),
      updated_at: getUnixTime(),
      transaction_amount: transaction.transaction_amount,
      action_to: 'operator',
      action_from: 'operator',
      percentage_fee: operatorCalc.percentageFee,
      fix_fee: operatorCalc.fixFee,
      total_fee: operatorCalc.totalFee
      // settlement_amount: operatorCalc.settlementAmount
    })

    const merchantTotalFee = institutionSettlement.total_fee + operatorSettlement.total_fee

    // settlement for merchant
    const merchantSettlement = await new Settlement({
      settlement_id: generateID(RANDOM_STRING_FOR_CONCAT),
      merchant_id: merchantID,
      merchant_id_native: merchant._id,
      transaction_id: transactionID,
      transaction_id_native: transaction._id,
      payment_date: transaction.created_at,
      status: 'PNDNG',
      created_at: getUnixTime(),
      updated_at: getUnixTime(),
      transaction_amount: transaction.transaction_amount,
      action_to: 'merchant',
      action_from: 'operator',
      settlement_amount: amount - merchantTotalFee
    })

    await institutionSettlement.save()
    await operatorSettlement.save()
    await merchantSettlement.save()

    return true
  } catch (err) {
    throw new Error(err)
  }
}

const calculateFee = (amount, entity) => {
  const percentageFee = amount * entity.percentage_fee_amount
  const fixFee = entity.fix_fee_amount
  const totalFee = percentageFee + fixFee
  const settlementAmount = amount - totalFee

  return {
    percentageFee,
    fixFee,
    totalFee,
    settlementAmount
  }
}

const createTopUpSettlement = async () => {

}

module.exports = {
  setSettlementService,
  createPaymentSettlement,
  createTopUpSettlement
}
