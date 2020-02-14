var {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull
} = require('graphql')

const user = new GraphQLObjectType({
  name: 'User',
  description: 'model for user',
  fields: () => {
    return {
      id: {
        type: GraphQLString,
        resolve (r) {
          return r.id
        }
      },
      email: {
        type: GraphQLString,
        resolve (r) {
          return r.email
        }
      }
    }
  }
})

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields: () => {
    return {
      readUser: {
        type: new GraphQLList(user),
        resolve (r, args) {
          return new Promise((resolve, reject) => {
            resolve([{ id: 'user1', email: 'user1@gmail.com' }])
          })
        }
      }
    }
  }
})
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to create stuff',
  fields: () => {
    return {
      createUser: {
        type: user,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) }
        }
      }
    }
  }
})

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})

module.exports = Schema
