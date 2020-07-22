const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const Subject = require('../Model')
const { SubjectType } = require('./type')
const { fetchAllSubjects, fetchDetailSubject } = require('../services')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} = graphql

const getSubjectById = {
  type: new GraphQLObjectType({
    name: 'getSubjectById' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      subject: { type: SubjectType }
    })
  }),
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  async resolve (parent, args, context) {
    return (async (id) => {
      try {
        return { status: 200, success: 'Successfully get Data', subject: await Subject.findById(id) }
      } catch (err) {
        return { status: 400, error: err }
      }
    })(args.id)
  }
}
const getAllSubjects = {
  type: new GraphQLObjectType({
    name: 'getAllSubjects' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(SubjectType) },
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
    return fetchAllSubjects(args, context)
  }
}
const getDetailSubject = {
  type: new GraphQLObjectType({
    name: 'getDetailSubject' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      data_detail: { type: SubjectType }
    })
  }),
  args: {
    id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchDetailSubject(args, context)
  }
}

module.exports = {
  getSubjectById,
  getAllSubjects,
  getDetailSubject
}
