const graphql = require('graphql')
const { UserRoleType } = require('./type')
const { doUpdateUserRole, doDeleteUserRole, doCreateUserRole } = require('../services')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLID
} = graphql

const createUserRole = {
  type: new GraphQLObjectType({
    name: 'createUserRole' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: UserRoleType }
    })
  }),
  args: {
    user_id: { type: GraphQLString },
    role_id: { type: GraphQLList(GraphQLString) }
  },
  async resolve (parent, args, context) {
    return doCreateUserRole(args, context)
  }
}
const updateUserRole = {
  type: new GraphQLObjectType({
    name: 'updateUserRole' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: UserRoleType }
    })
  }),
  args: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    status: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return doUpdateUserRole(args, context)
  }
}
const deleteUserRole = {
  type: new GraphQLObjectType({
    name: 'deleteUserRole' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString }
    })
  }),
  args: {
    _id: { type: GraphQLID }
  },
  async resolve (parent, args, context) {
    return doDeleteUserRole(args, context)
  }
}
module.exports = {
  createUserRole,
  updateUserRole,
  deleteUserRole
}
