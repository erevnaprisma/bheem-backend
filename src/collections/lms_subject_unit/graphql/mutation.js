const graphql = require('graphql')
const { LmsSubjectUnitType } = require('./type')
const { doCreateLmsSubjectUnit, doUpdateLmsSubjectUnit, doDeleteLmsSubjectUnit } = require('../services')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLID
} = graphql

const createLmsSubjectUnit = {
  type: new GraphQLObjectType({
    name: 'createLmsSubjectUnit' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: LmsSubjectUnitType }
    })
  }),
  args: {
    points: { type: GraphQLString },
    grading_id: { type: GraphQLString },
    content1: { type: GraphQLString },
    subject_id: { type: GraphQLString },
    title: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return doCreateLmsSubjectUnit(args, context)
  }
}
const updateLmsSubjectUnit = {
  type: new GraphQLObjectType({
    name: 'updateLmsSubjectUnit' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: LmsSubjectUnitType }
    })
  }),
  args: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    grading_id: { type: GraphQLString },
    points: { type: GraphQLString },
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
    return doUpdateLmsSubjectUnit(args, context)
  }
}
const deleteLmsSubjectUnit = {
  type: new GraphQLObjectType({
    name: 'deleteLmsSubjectUnit' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString }
    })
  }),
  args: {
    _id: { type: GraphQLID }
  },
  async resolve (parent, args, context) {
    return doDeleteLmsSubjectUnit(args, context)
  }
}
module.exports = {
  createLmsSubjectUnit,
  updateLmsSubjectUnit,
  deleteLmsSubjectUnit
}
