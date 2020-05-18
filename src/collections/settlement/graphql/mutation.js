const {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt
} = require('graphql')

const { TransactionSettlement, TransactionResponse, SettlementResponse } = require('./type')
const { setSettlementService, createPaymentSettlement, getSettlementsService } = require('../services')

const setSettlement = {
  type: TransactionSettlement,
  args: {
    transactions: { type: GraphQLList(GraphQLString) },
    settlements: { type: GraphQLList(GraphQLString) }
  },
  resolve (parent, args) {
    return setSettlementService(args.transactions, args.settlements)
  }
}

const getSettlements = {
  type: SettlementResponse,
  resolve (parent, args) {
    return getSettlementsService()
  }
}

module.exports = {
  setSettlement,
  getSettlements
}
