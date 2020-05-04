const graphql = require('graphql')

// type
const { ResponseType, StaticPaymentScanType } = require('./type')
const { TransactionDetailType, TransactionHistoryType, DynamicPaymentScanType } = require('./type')

// service
const serviceTopupVaService = require('../payment_services/top_up/topUpVa')
const serviceTopUpInstitution = require('../payment_services/top_up/topUpInstitution')
const serviceTopUpMerchant = require('../payment_services/top_up/topUpMerchant')
const serviceStaticPaymentService = require('../payment_services/static_payment/staticPayment')
const scanPaymentStaticService = require('../payment_services/static_payment/scanPaymentStatic')
const detailPaymentService = require('../payment_services/static_payment/detailPayment')
const cancelStaticPaymentService = require('../payment_services/static_payment/cancelPayment')
const dynamicPaymentService = require('../payment_services/dynamic_qr_payment/dynamicPayment')
const scanPaymentDynamicService = require('../payment_services/dynamic_qr_payment/scanPaymentDynamic')
const transactionHistoryService = require('../payment_services/transactionHistory')

const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLID
} = graphql

const topupVa = {
  type: ResponseType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    amount: { type: new GraphQLNonNull(GraphQLInt) }
  },
  resolve (parent, args) {
    return serviceTopupVaService(args)
  }
}

const topupInstitution = {
  type: ResponseType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    amount: { type: new GraphQLNonNull(GraphQLInt) },
    institution_id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return serviceTopUpInstitution(args)
  }
}

const topupMerchant = {
  type: ResponseType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    amount: { type: new GraphQLNonNull(GraphQLInt) },
    merchant_id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return serviceTopUpMerchant(args)
  }
}

const staticPayment = {
  type: ResponseType,
  args: {
    merchant_id: { type: new GraphQLNonNull(GraphQLID) },
    transaction_id: { type: new GraphQLNonNull(GraphQLID) },
    bill_id: { type: new GraphQLNonNull(GraphQLID) },
    amount: { type: new GraphQLNonNull(GraphQLInt) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    institution_id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return serviceStaticPaymentService(args.merchant_id, args.amount, args.user_id, args.transaction_id, args.bill_id, args.password, args.institution_id)
  }
}

const dynamicPayment = {
  type: ResponseType,
  args: {
    merchant_id: { type: new GraphQLNonNull(GraphQLID) },
    transaction_id: { type: new GraphQLNonNull(GraphQLID) },
    amount: { type: new GraphQLNonNull(GraphQLInt) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    institution_id: { type: new GraphQLNonNull(GraphQLString) },
    qr_id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return dynamicPaymentService(args.merchant_id, args.amount, args.user_id, args.transaction_id, args.password, args.institution_id, args.qr_id)
  }
}

const scanPaymentStatic = {
  type: StaticPaymentScanType,
  args: {
    merchant_id: { type: new GraphQLNonNull(GraphQLID) },
    qr_id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    institution_id: { type: GraphQLString }
  },
  resolve (parent, args) {
    return scanPaymentStaticService({ merchantID: args.merchant_id, userID: args.user_id, qrID: args.qr_id, institutionID: args.institution_id })
  }
}

const scanPaymentDynamic = {
  type: DynamicPaymentScanType,
  args: {
    merchant_id: { type: new GraphQLNonNull(GraphQLID) },
    qr_id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    institution_id: { type: GraphQLString },
    amount: { type: new GraphQLNonNull(GraphQLInt) },
    bill_id: { type: new GraphQLNonNull(GraphQLString) },
    transaction_id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return scanPaymentDynamicService({ merchantID: args.merchant_id, userID: args.user_id, qrID: args.qr_id, institutionID: args.institution_id, amount: args.amount, bill_id: args.bill_id, transaction_id: args.transaction_id, })
  }
}

const detailPayment = {
  type: TransactionDetailType,
  args: {
    transaction_id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve (parent, args) {
    return detailPaymentService(args.transaction_id)
  }
}

const transactionReceipt = {
  type: TransactionDetailType,
  args: {
    transaction_id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve (parent, args) {
    return detailPaymentService(args.transaction_id)
  }
}

const cancelStaticPayment = {
  type: ResponseType,
  args: {
    transaction_id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve (parent, args) {
    return cancelStaticPaymentService(args.transaction_id)
  }
}

module.exports.topupVa = topupVa
module.exports.staticPayment = staticPayment
module.exports.scanPaymentStatic = scanPaymentStatic
module.exports.detailPayment = detailPayment
module.exports.cancelStaticPayment = cancelStaticPayment
module.exports.transactionReceipt = transactionReceipt
module.exports.topupInstitution = topupInstitution
module.exports.topupMerchant = topupMerchant
module.exports.dynamicPayment = dynamicPayment
module.exports.scanPaymentDynamic = scanPaymentDynamic
