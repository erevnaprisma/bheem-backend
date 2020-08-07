const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { LmsGradingType } = require('./type')
const { fetchAllLmsGradings, fetchDetailLmsGrading, fetchAllLmsGradingsByCourseId } = require('../services')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} = graphql

const getAllLmsGradings = {
  type: new GraphQLObjectType({
    name: 'getAllLmsGradings' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(LmsGradingType) },
      count: { type: GraphQLLong },
      page_count: { type: GraphQLLong }
    })
  }),
  args: {
    page_size: { type: GraphQLInt },
    course_id: { type: GraphQLString },
    page_index: { type: GraphQLInt },
    string_to_search: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchAllLmsGradings(args, context)
  }
}
const getAllGradingsByCourseId = {
  type: new GraphQLObjectType({
    name: 'getAllGradingsByCourseId' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(LmsGradingType) },
      count: { type: GraphQLLong },
      page_count: { type: GraphQLLong }
    })
  }),
  args: {
    page_size: { type: GraphQLInt },
    course_id: { type: GraphQLString },
    page_index: { type: GraphQLInt },
    string_to_search: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchAllLmsGradingsByCourseId(args, context)
  }
}
const getDetailLmsGrading = {
  type: new GraphQLObjectType({
    name: 'getDetailLmsGrading' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      data_detail: { type: LmsGradingType }
    })
  }),
  args: {
    id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchDetailLmsGrading(args, context)
  }
}

module.exports = {
  getAllLmsGradings,
  getAllGradingsByCourseId,
  getDetailLmsGrading
}
