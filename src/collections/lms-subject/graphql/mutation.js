const graphql = require('graphql')
const { SubjectType } = require('./type')
const { doCreateSubject, doUpdateSubject, doDeleteSubject } = require('../services')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLID
} = graphql

const createSubject = {
  type: new GraphQLObjectType({
    name: 'createSubject' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: SubjectType }
    })
  }),
  args: {
    title: { type: GraphQLString },
    content1: { type: GraphQLString },
    start_date: { type: GraphQLString },
    end_date: { type: GraphQLString },
    course_id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return doCreateSubject(args, context)
  }
}
const updateSubject = {
  type: new GraphQLObjectType({
    name: 'updateSubject' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: SubjectType }
    })
  }),
  args: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
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
    return doUpdateSubject(args, context)
  }
}
const deleteSubject = {
  type: new GraphQLObjectType({
    name: 'deleteSubject' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString }
    })
  }),
  args: {
    _id: { type: GraphQLID }
  },
  async resolve (parent, args, context) {
    return doDeleteSubject(args, context)
  }
}
module.exports = {
  createSubject,
  updateSubject,
  deleteSubject
}
