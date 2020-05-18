const {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt
} = require('graphql')

const { TransactionSettlement, TransactionResponse } = require('./type')
const { setSettlementService, createPaymentSettlement } = require('../services')

const setSettlement = {
  type: TransactionSettlement,
  args: {
    transactions: { type: GraphQLList(GraphQLString) }
  },
  resolve (parent, args) {
    return setSettlementService(args.transactions)
  }
}

module.exports = {
  setSettlement
}
