const graphql = require('graphql')

// User
const { login, logout, signUp } = require('./src/collections/user/graphql/mutation')
const { getAllUser } = require('./src/collections/user/graphql/query')

// Meeting
const { createMeeting } = require('./src/collections/meeting/graphql/mutation')

const {
  GraphQLObjectType,
  GraphQLSchema
} = graphql

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getAllUser
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signUp,
    login,
    logout,
    createMeeting
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
