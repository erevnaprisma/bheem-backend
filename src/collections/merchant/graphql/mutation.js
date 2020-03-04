const graphql = require('graphql')

const { MerchantResponseType } = require('./type')
const { addMerchantAccount } = require('../services')

const {
  GraphQLString,
  GraphQLNonNull
} = graphql

const signUpMerchant = {
  type: MerchantResponseType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    device_id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return addMerchantAccount(args.email, args.device_id)
  }
}

module.exports.signUpMerchant = signUpMerchant
