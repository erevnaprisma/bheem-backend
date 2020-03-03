const graphql = require('graphql')

const { EmoneyResponseType } = require('./type')
const { PaymentType } = require('./type')
const { addTransaction } = require('../services')

const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} = graphql

const addDummy = {
  type: EmoneyResponseType,
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    transaction_id: { type: new GraphQLNonNull(GraphQLID) },
    bill_id: { type: new GraphQLNonNull(GraphQLString) },
    transaction_amount: { type: new GraphQLNonNull(GraphQLInt) },
    saldo: { type: new GraphQLNonNull(GraphQLInt) },
    type: { type: new GraphQLNonNull(PaymentType) }
  },
  resolve (args) {
    return addTransaction(args.user_id, args.transaction_id, args.bill_id, args.transaction_amount, args.saldo, args.type)
  }
}

module.exports.addDummy = addDummy
