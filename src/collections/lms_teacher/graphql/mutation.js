const graphql = require('graphql')
const { TeacherType } = require('./type')
const Teacher = require('../Model')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt
} = graphql

const createTeacher = {
  type: new GraphQLObjectType({
    name: 'createTeacherResponse',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      teacher: { type: TeacherType }
    })
  }),
  args: {
    user_id: { type: GraphQLString },
    created_at: { type: GraphQLInt },
    updated_at: { type: GraphQLInt }
  },
  async resolve (parent, args, context) {
    return (async (args) => {
      try {
        const teacherDetail = await new Teacher(args).save()
        return { status: 200, success: 'Successfully save Teacher', teacher: teacherDetail }
      } catch (err) {
        return { status: 400, error: err }
      }
    })(args)
  }
}
module.exports = {
  createTeacher
}
