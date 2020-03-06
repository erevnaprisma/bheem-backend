const graphql = require('graphql')

const { ResponseType } = require('./type')
const serviceTopupVa = require('../payment_services/topUpVa')
const serviceStaticPayment = require('../payment_services/staticPayment')

const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLID
} = graphql

const topupVa = {
  type: ResponseType,
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLString) },
    amount: { type: new GraphQLNonNull(GraphQLInt) }
  },
  resolve (parent, args) {
    return serviceTopupVa(args)
  }
}

const staticPayment = {
  type: ResponseType,
  args: {
    merchant_id: { type: new GraphQLNonNull(GraphQLString) },
    amount: { type: new GraphQLNonNull(GraphQLInt) },
    user_id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve (parent, args) {
    return serviceStaticPayment(args.merchant_id, args.amount, args.user_id)
  }
}

module.exports.topupVa = topupVa
module.exports.staticPayment = staticPayment
