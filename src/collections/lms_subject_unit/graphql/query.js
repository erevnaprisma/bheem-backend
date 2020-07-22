const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { LmsSubjectUnitType } = require('./type')
const { fetchAllLmsSubjectUnits, fetchDetailLmsSubjectUnit } = require('../services')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} = graphql

const getAllLmsSubjectUnits = {
  type: new GraphQLObjectType({
    name: 'getAllLmsSubjectUnits' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(LmsSubjectUnitType) },
      count: { type: GraphQLLong },
      page_count: { type: GraphQLLong }
    })
  }),
  args: {
    page_size: { type: GraphQLInt },
    subject_id: { type: GraphQLString },
    page_index: { type: GraphQLInt },
    string_to_search: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchAllLmsSubjectUnits(args, context)
  }
}
const getDetailLmsSubjectUnit = {
  type: new GraphQLObjectType({
    name: 'getDetailLmsSubjectUnit' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      data_detail: { type: LmsSubjectUnitType }
    })
  }),
  args: {
    id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchDetailLmsSubjectUnit(args, context)
  }
}

module.exports = {
  getAllLmsSubjectUnits,
  getDetailLmsSubjectUnit
}
