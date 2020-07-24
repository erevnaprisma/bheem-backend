const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const Course = require('../Model')
const { CourseType } = require('./type')
const { fetchAllCourses, fetchDetailCourse } = require('../services')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} = graphql

const getCourseById = {
  type: new GraphQLObjectType({
    name: 'getCourseById' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      course: { type: CourseType }
    })
  }),
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  async resolve (parent, args, context) {
    return (async (id) => {
      try {
        return { status: 200, success: 'Successfully get Data', course: await Course.findById(id) }
      } catch (err) {
        return { status: 400, error: err }
      }
    })(args.id)
  }
}
const getAllCourses = {
  type: new GraphQLObjectType({
    name: 'getAllCourses' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(CourseType) },
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
    return fetchAllCourses(args, context)
  }
}
const getDetailCourse = {
  type: new GraphQLObjectType({
    name: 'getDetailCourse' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      data_detail: { type: CourseType }
    })
  }),
  args: {
    id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchDetailCourse(args, context)
  }
}

module.exports = {
  getCourseById,
  getAllCourses,
  getDetailCourse
}
