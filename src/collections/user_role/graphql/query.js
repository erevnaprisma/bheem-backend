const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const Course = require('../Model')
const { UserRoleType } = require('./type')
const { fetchAllUserRoles, fetchDetailUserRole, fetchDetailUserRoleByMyUserId } = require('../services')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} = graphql

const getAllUserRoles = {
  type: new GraphQLObjectType({
    name: 'getAllUserRoles' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(UserRoleType) },
      count: { type: GraphQLLong },
      page_count: { type: GraphQLLong }
    })
  }),
  args: {
    page_size: { type: GraphQLInt },
    page_index: { type: GraphQLInt },
    string_to_search: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchAllUserRoles(args, context)
  }
}
const getDetailUserRole = {
  type: new GraphQLObjectType({
    name: 'getDetailUserRole' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      data_detail: { type: UserRoleType }
    })
  }),
  args: {
    id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchDetailUserRole(args, context)
  }
}
const getDetailUserRoleByMyUserId = {
  type: new GraphQLObjectType({
    name: 'getDetailUserRoleByMyUserId' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      data_detail: { type: UserRoleType }
    })
  }),
  args: {},
  async resolve (parent, args, context) {
    return fetchDetailUserRoleByMyUserId(args, context)
  }
}

module.exports = {
  getDetailUserRoleByMyUserId,
  getAllUserRoles,
  getDetailUserRole
}
