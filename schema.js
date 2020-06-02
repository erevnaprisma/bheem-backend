const graphql = require('graphql')

const { login, logout, signUp } = require('./src/collections/user/graphql/mutation')
const { getAllUser } = require('./src/collections/user/graphql/query')

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
    logout
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
