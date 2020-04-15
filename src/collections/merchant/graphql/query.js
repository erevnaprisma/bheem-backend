const graphql = require('graphql')

const { AllMerchantResponseType, MerchantInfoResponseType, LoginResponseType } = require('./type')
const { getAllMerchantService, getMerchantInfoService, loginService } = require('../services')

const {
  GraphQLString,
  GraphQLNonNull
} = graphql

const AllMerchant = {
  type: AllMerchantResponseType,
  resolve (parent, args) {
    return getAllMerchantService()
  }
}

const MerchantInfo = {
  type: MerchantInfoResponseType,
  args: {
    merchantID: { type: new GraphQLNonNull(GraphQLString)}
  },
  resolve (parent, args) {
    return getMerchantInfoService(args.merchantID)
  }
}

const loginMerchant = {
  type: LoginResponseType,
  args: {
    access_token: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString }
  },
  resolve (parent, args) {
    return loginService(args.email, args.password, args.access_token, args.isLoggedInWithToken)
  }
}

module.exports = {
  AllMerchant,
  MerchantInfo,
  loginMerchant
}
