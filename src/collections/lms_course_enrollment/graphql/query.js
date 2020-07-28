const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { lmsEnrollmentUserType } = require('./type')
const { fetchAllEnrollmentUserByCourseId, fetchAllEnrollmentUserByFilter } = require('../services')
const { CourseType } = require('../../lms_course/graphql/type')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} = graphql

const getAllEnrollmentUserByCourseId = {
  type: new GraphQLObjectType({
    name: 'getAllEnrollmentUserByCourseId' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(lmsEnrollmentUserType) },
      count: { type: GraphQLLong },
      page_count: { type: GraphQLLong }
    })
  }),
  args: {
    distinct: { type: GraphQLString },
    page_size: { type: GraphQLInt },
    page_index: { type: GraphQLInt },
    string_to_search: { type: GraphQLString },
    course_id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchAllEnrollmentUserByCourseId(args, context)
  }
}
const getAllEnrollmentUserByFilter = {
  type: new GraphQLObjectType({
    name: 'getAllEnrollmentUserByFilter' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(lmsEnrollmentUserType) },
      count: { type: GraphQLLong },
      page_count: { type: GraphQLLong }
    })
  }),
  args: {
    distinct: { type: GraphQLString },
    page_size: { type: GraphQLInt },
    page_index: { type: GraphQLInt },
    string_to_search: { type: GraphQLString },
    course_id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchAllEnrollmentUserByFilter(args, context)
  }
}

module.exports = {
  getAllEnrollmentUserByCourseId,
  getAllEnrollmentUserByFilter
}
