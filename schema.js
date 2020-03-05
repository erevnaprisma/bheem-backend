const graphql = require('graphql')

const { signUp, changeUserEmail, changeUserPassword, changeUserName, changeUserProfile } = require('./src/collections/user/graphql/mutation')

// User
const { login, getProfile, allUser } = require('./src/collections/user/graphql/query')

// Emoney
const { allTransaction } = require('./src/collections/emoney/graphql/query')

// Merchant
const { signUpMerchant } = require('./src/collections/merchant/graphql/mutation')

// Services
const { topupVa } = require('./src/services/graphql/mutation')

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
    topupVa
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
