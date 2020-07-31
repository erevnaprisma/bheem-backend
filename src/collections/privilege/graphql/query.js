const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { PrivilegeType } = require('./type')
const { fetchAllPrivileges, fetchDetailPrivilege } = require('../services')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} = graphql

const getAllPrivileges = {
  type: new GraphQLObjectType({
    name: 'getAllPrivileges' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(PrivilegeType) },
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
    return fetchAllPrivileges(args, context)
  }
}
const getDetailPrivilege = {
  type: new GraphQLObjectType({
    name: 'getDetailPrivilege' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      data_detail: { type: PrivilegeType }
    })
  }),
  args: {
    id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchDetailPrivilege(args, context)
  }
}

module.exports = {
  getAllPrivileges,
  getDetailPrivilege
}
