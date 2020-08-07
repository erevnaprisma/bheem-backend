const graphql = require('graphql')
const { LmsGradingType } = require('./type')
const { doCreateLmsGrading, doUpdateLmsGrading, doDeleteLmsGrading } = require('../services')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLID
} = graphql

const createLmsGrading = {
  type: new GraphQLObjectType({
    name: 'createLmsGrading' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: LmsGradingType }
    })
  }),
  args: {
    title: { type: GraphQLString },
    points: { type: GraphQLString },
    course_id: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return doCreateLmsGrading(args, context)
  }
}
const updateLmsGrading = {
  type: new GraphQLObjectType({
    name: 'updateLmsGrading' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: LmsGradingType }
    })
  }),
  args: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    points: { type: GraphQLString },
    course_id: { type: GraphQLString },
    status: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
    created_by: { type: GraphQLString },
    updated_by: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return doUpdateLmsGrading(args, context)
  }
}
const deleteLmsGrading = {
  type: new GraphQLObjectType({
    name: 'deleteLmsGrading' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString }
    })
  }),
  args: {
    _id: { type: GraphQLID }
  },
  async resolve (parent, args, context) {
    return doDeleteLmsGrading(args, context)
  }
}
module.exports = {
  createLmsGrading,
  updateLmsGrading,
  deleteLmsGrading
}
