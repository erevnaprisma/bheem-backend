const graphql = require('graphql')

const { ResponseType, StaticPaymentScanType } = require('./type')
const { TransactionDetailType } = require('./type')
const serviceTopupVaService = require('../payment_services/topUpVa')
const serviceStaticPaymentService = require('../payment_services/static_payment/staticPayment')
const scanPaymentStaticService = require('../payment_services/static_payment/scanPaymentStatic')
const detailPaymentService = require('../payment_services/static_payment/detailPayment')
const cancelStaticPaymentService = require('../payment_services/static_payment/cancelPayment')

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

const staticPayment = {
  type: ResponseType,
  args: {
    merchant_id: { type: new GraphQLNonNull(GraphQLID) },
    transaction_id: { type: new GraphQLNonNull(GraphQLID) },
    bill_id: { type: new GraphQLNonNull(GraphQLID) },
    amount: { type: new GraphQLNonNull(GraphQLInt) },
    user_id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve (parent, args) {
    return serviceStaticPaymentService(args.merchant_id, args.amount, args.user_id, args.transaction_id, args.bill_id)
  }
}

const scanPaymentStatic = {
  type: StaticPaymentScanType,
  args: {
    merchant_id: { type: new GraphQLNonNull(GraphQLID) },
    qr_id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve (parent, args) {
    return scanPaymentStaticService({ merchantID: args.merchant_id, userID: args.user_id, qrID: args.qr_id })
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
