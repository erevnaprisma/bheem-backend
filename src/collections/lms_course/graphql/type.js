const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { UserType } = require('../../user/graphql/type')
const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInt
} = graphql
const CourseType = new GraphQLObjectType({
  name: 'lms_course',
  fields: () => ({
    _id: { type: GraphQLID },
    code: { type: GraphQLString },
    batch: { type: GraphQLInt },
    title: { type: GraphQLString },
    content1: { type: GraphQLString },
    content2: { type: GraphQLString },
    content3: { type: GraphQLString },
    start_date: { type: GraphQLLong },
    end_date: { type: GraphQLLong },
    created_by: { type: UserType },
    updated_by: { type: UserType },
    created_at: { type: GraphQLLong },
    updated_at: { type: GraphQLLong }
  })
})
module.exports = {
  CourseType
}
