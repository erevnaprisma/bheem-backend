const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { UserType } = require('../../user/graphql/type')
const { SubjectType } = require('../../lms-subject/graphql/type')
const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInt
} = graphql
const LmsSubjectUnitType = new GraphQLObjectType({
  name: 'lms_subject_unit',
  fields: () => ({
    _id: { type: GraphQLID },
    content1: { type: GraphQLString },
    subject_id: { type: SubjectType },
    start_date: { type: GraphQLLong },
    end_date: { type: GraphQLLong },
    created_by: { type: UserType },
    updated_by: { type: UserType },
    created_at: { type: GraphQLLong },
    updated_at: { type: GraphQLLong }
  })
})
module.exports = {
  LmsSubjectUnitType
}
