const graphql = require('graphql')

// User
const { signUp, changeUserEmail, changeUserPassword, changeUserName, changeUserProfile, logout } = require('./src/collections/user/graphql/mutation')
const { login, getProfile, allUser  } = require('./src/collections/user/graphql/query')

// Emoney
const { allTransaction } = require('./src/collections/emoney/graphql/query')

// Merchant
const { signUpMerchant } = require('./src/collections/merchant/graphql/mutation')

// Qr
const { createQrStatic } = require('./src/collections/qr/graphql/mutation')

// Otp
const { sendOtp, submitOtp } = require('./src/collections/otp/graphql/mutation')

// Services
const { topupVa, staticPayment, scanPaymentStatic, detailPayment, cancelStaticPayment } = require('./src/services/graphql/mutation')

const {
  GraphQLObjectType,
  GraphQLSchema
} = graphql

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    login,
    getProfile,
    allUser,
    allTransaction
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signUp,
    changeUserEmail,
    changeUserName,
    changeUserPassword,
    changeUserProfile,
    signUpMerchant,
    topupVa,
    staticPayment,
    createQrStatic,
    scanPaymentStatic,
    detailPayment,
    cancelStaticPayment,
    sendOtp,
    submitOtp,
    logout
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
