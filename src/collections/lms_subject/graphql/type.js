const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { UserType } = require('../../user/graphql/type')
const { CourseType } = require('../../lms_course/graphql/type')
const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInt
} = graphql
const SubjectType = new GraphQLObjectType({
  name: 'lms_subject',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    content1: { type: GraphQLString },
    course_id: { type: CourseType },
    start_date: { type: GraphQLLong },
    end_date: { type: GraphQLLong },
    created_by: { type: UserType },
    updated_by: { type: UserType },
    created_at: { type: GraphQLLong },
    updated_at: { type: GraphQLLong }
  })
})
module.exports = {
  SubjectType
}
