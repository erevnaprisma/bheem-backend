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

// GraphQLObjectTypeConfig
var lmsEnrollmentUserType = new GraphQLObjectType({
  name: 'lms_enrollment_user',
  fields: () => ({
    _id: { type: GraphQLID },
    batch: { type: GraphQLInt },
    status: { type: GraphQLString },
    user_id: { type: UserType },
    course_id: { type: CourseType },
    created_by: { type: UserType },
    updated_by: { type: UserType },
    created_at: { type: GraphQLLong },
    updated_at: { type: GraphQLLong }
  })
})
// var lmsEnrollmentCourseType = new GraphQLObjectType({
//   name: 'lms_enrollment_course',
//   fields: () => ({
//     _id: { type: GraphQLID },
//     batch: { type: GraphQLInt },
//     status: { type: GraphQLString },
//     users: { type: GraphQLList(lmsEnrollmentUserType) },
//     course_id: { type: CourseType },
//     created_by: { type: UserType },
//     updated_by: { type: UserType },
//     created_at: { type: GraphQLLong },
//     updated_at: { type: GraphQLLong }
//   })
// })
module.exports = {
  lmsEnrollmentUserType
  // lmsEnrollmentCourseType
}
