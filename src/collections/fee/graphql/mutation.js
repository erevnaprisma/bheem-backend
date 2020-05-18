const graphql = require('graphql')

const { FeeResponseType } = require('./type')
const { createFeeService, setMerchantSchemaFee } = require('../services')
const { TransactionMethodType } = require('../../transaction/graphql/type')
const { ActionTo } = require('./type')

const {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat
} = graphql

const addFee = {
  type: FeeResponseType,
  args: {
    fix_fee: { type: new GraphQLNonNull(GraphQLInt) },
    percentage_fee: { type: new GraphQLNonNull(GraphQLFloat) },
    action_to: { type: new GraphQLNonNull(ActionTo) },
    transaction_method: { type: new GraphQLNonNull(TransactionMethodType) }
  },
  resolve (parent, args) {
    return createFeeService(args.fix_fee, args.percentage_fee, args.action_to, args.transaction_method)
  }
}

const setMerchantFee = {
  type: FeeResponseType,
  args: {
    merchant_id: { type: new GraphQLNonNull(GraphQLString) },
    fee_method: { type: new GraphQLNonNull(TransactionMethodType) },
    operator_fee_code: { type: new GraphQLNonNull(GraphQLString) },
    institution_fee_code: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return setMerchantSchemaFee(args.merchant_id, args.operator_fee_code, args.institution_fee_code, args.fee_method)
  }
}

module.exports = {
  addFee,
  setMerchantFee
}
