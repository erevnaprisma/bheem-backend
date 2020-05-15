const graphql = require('graphql')

const { FeeResponseType } = require('./type')
const { createFeeService } = require('../services')
const { TransactionMethodType } = require('../../transaction/graphql/type')
const { ActionTo } = require('./type')

const {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString
} = graphql

const addFee = {
  type: FeeResponseType,
  args: {
    fix_fee: { type: GraphQLNonNull(GraphQLInt) },
    percentage_fee: { type: GraphQLNonNull(GraphQLString) },
    action_to: { type: GraphQLNonNull(ActionTo) },
    transaction_method: { type: GraphQLNonNull(TransactionMethodType) }
  },
  resolve (parent, args) {
    return createFeeService(args.fix_fee, args.percentage_fee, args.action_to, args.transaction_method)
  }
}

module.exports = {
  addFee
}
