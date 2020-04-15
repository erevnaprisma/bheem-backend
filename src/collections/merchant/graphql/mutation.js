const graphql = require('graphql')

const { MerchantResponseType } = require('./type')
const { addMerchantService, serviceLogout } = require('../services')

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
    return addMerchantService(args.email, args.device_id)
  }
}

const logoutMerchant = {
  type: MerchantResponseType,
  args: {
    access_token: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return serviceLogout(args.access_token)
  }
}

module.exports.signUpMerchant = signUpMerchant
module.exports.logoutMerchant = logoutMerchant
