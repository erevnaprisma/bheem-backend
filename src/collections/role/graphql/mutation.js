const graphql = require('graphql')
const { RoleType } = require('./type')
const { doUpdateRole, doDeleteRole, doCreateRole } = require('../services')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLID
} = graphql

const createRole = {
  type: new GraphQLObjectType({
    name: 'createRole' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: RoleType }
    })
  }),
  args: {
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    privilege_id: { type: GraphQLList(GraphQLString) }
  },
  async resolve (parent, args, context) {
    return doCreateRole(args, context)
  }
}
const updateRole = {
  type: new GraphQLObjectType({
    name: 'updateRole' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: RoleType }
    })
  }),
  args: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    privilege_id: { type: GraphQLList(GraphQLString) },
    status: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return doUpdateRole(args, context)
  }
}
const deleteRole = {
  type: new GraphQLObjectType({
    name: 'deleteRole' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString }
    })
  }),
  args: {
    _id: { type: GraphQLID }
  },
  async resolve (parent, args, context) {
    return doDeleteRole(args, context)
  }
}
module.exports = {
  createRole,
  updateRole,
  deleteRole
}
