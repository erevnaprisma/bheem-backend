const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const Course = require('../Model')
const { RoleType } = require('./type')
const { fetchAllRoles, fetchDetailRole } = require('../services')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} = graphql

const getAllRoles = {
  type: new GraphQLObjectType({
    name: 'getAllRoles' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(RoleType) },
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
    return fetchAllRoles(args, context)
  }
}
const getDetailRole = {
  type: new GraphQLObjectType({
    name: 'getDetailRole' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      data_detail: { type: RoleType }
    })
  }),
  args: {
    id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchDetailRole(args, context)
  }
}

module.exports = {
  getAllRoles,
  getDetailRole
}
