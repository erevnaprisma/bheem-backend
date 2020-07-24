const graphql = require('graphql')
const { lmsEnrollmentUserType } = require('./type')
const { doSubmitCourseEnrollmentRequest } = require('../services')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLID
} = graphql

const submitCourseEnrollmentRequest = {
  type: new GraphQLObjectType({
    name: 'submitCourseEnrollmentRequest' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: lmsEnrollmentUserType }
    })
  }),
  args: {
    course_id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return doSubmitCourseEnrollmentRequest(args, context)
  }
}
module.exports = {
  submitCourseEnrollmentRequest
}
