const {
  GraphQLString,
  GraphQLList
} = require('graphql')

const { TransactionSettlement } = require('./type')
const { setSettlementService } = require('../services')

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