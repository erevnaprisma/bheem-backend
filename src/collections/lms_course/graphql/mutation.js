const graphql = require('graphql')
const { CourseType } = require('./type')
const { doCreateCourse, doUpdateCourse, doDeleteCourse } = require('../services')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLID
} = graphql

const createCourse = {
  type: new GraphQLObjectType({
    name: 'createCourse' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: CourseType }
    })
  }),
  args: {
    title: { type: GraphQLString },
    content1: { type: GraphQLString },
    content2: { type: GraphQLString },
    content3: { type: GraphQLString },
    status: { type: GraphQLString },
    start_date: { type: GraphQLString },
    end_date: { type: GraphQLString },
    code: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return doCreateCourse(args, context)
  }
}
const updateCourse = {
  type: new GraphQLObjectType({
    name: 'updateCourse' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: CourseType }
    })
  }),
  args: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    status: { type: GraphQLString },
    content1: { type: GraphQLString },
    content2: { type: GraphQLString },
    content3: { type: GraphQLString },
    start_date: { type: GraphQLString },
    end_date: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
    created_by: { type: GraphQLString },
    updated_by: { type: GraphQLString },
    code: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return doUpdateCourse(args, context)
  }
}
const deleteCourse = {
  type: new GraphQLObjectType({
    name: 'deleteCourse' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString }
    })
  }),
  args: {
    _id: { type: GraphQLID }
  },
  async resolve (parent, args, context) {
    return doDeleteCourse(args, context)
  }
}
module.exports = {
  createCourse,
  updateCourse,
  deleteCourse
}
