const graphql = require('graphql')

const { EmoneyResponseType } = require('./type')
const { PaymentType } = require('./type')
const { addUserPayment } = require('../services')

const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} = graphql

const addPayment = {
  type: EmoneyResponseType,
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    transaction_id: { type: new GraphQLNonNull(GraphQLID) },
    bill_id: { type: new GraphQLNonNull(GraphQLString) },
    transaction_amount: { type: new GraphQLNonNull(GraphQLInt) },
    saldo: { type: new GraphQLNonNull(GraphQLInt) },
    type: { type: new GraphQLNonNull(PaymentType) }
  },
  resolve (parent, args) {
    console.log(args.user_id)
    return addUserPayment(args)
  }
}

module.exports.addPayment = addPayment
