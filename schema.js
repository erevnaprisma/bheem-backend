const graphql = require('graphql')

// User
const { signUp, changeUserPassword, changeUserName, changeUserProfile, logout } = require('./src/collections/user/graphql/mutation')
const { login, getProfile, allUser } = require('./src/collections/user/graphql/query')

// Emoney
const { allTransaction } = require('./src/collections/emoney/graphql/query')

// Merchant
const { signUpMerchant, logoutMerchant } = require('./src/collections/merchant/graphql/mutation')
const { AllMerchant, MerchantInfo, loginMerchant } = require('./src/collections/merchant/graphql/query')

// Institution
const { logoutInstitution, signUpInstitution } = require('./src/collections/institution/graphql/mutation')
const { AllInstitution, loginInstitution, InstitutionInfo } = require('./src/collections/institution/graphql/query')

// Qr
const { createQrStatic, testing } = require('./src/collections/qr/graphql/mutation')
const { showQR } = require('./src/collections/qr/graphql/query')

// Otp
const { sendOtp, submitOtp, changePasswordViaForgetPassword, forgetPasswordSendOtp } = require('./src/collections/otp/graphql/mutation')

// Services
const { topupVa, staticPayment, scanPaymentStatic, detailPayment, cancelStaticPayment, transactionReceipt } = require('./src/services/graphql/mutation')
const { transactionHistory } = require('./src/services/graphql/query')

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
    allTransaction,
    transactionHistory,
    showQR,
    AllMerchant,
    MerchantInfo,
    loginMerchant,
    AllInstitution,
    loginInstitution,
    InstitutionInfo
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signUp,
    // changeUserEmail,
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
    testing,
    transactionReceipt,
    logout,
    changePasswordViaForgetPassword,
    forgetPasswordSendOtp,
    logoutMerchant,
    logoutInstitution,
    signUpInstitution
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
