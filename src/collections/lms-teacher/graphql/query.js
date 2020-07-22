const graphql = require('graphql')
const Teacher = require('../Model')
const { TeacherType } = require('./type')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} = graphql

const getTeacherById = {
  type: new GraphQLObjectType({
    name: 'getTeacherByIdResponse',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      teacher: { type: TeacherType }
    })
  }),
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  async resolve (parent, args, context) {
    return (async (id) => {
      try {
        const teacherDetail = await Teacher.findById(id)
        return { status: 200, success: 'Successfully get Teacher', teacherDetail }
      } catch (err) {
        return { status: 400, error: err }
      }
    })(args.id)
  }
}
const getAllTeachers = {
  type: new GraphQLObjectType({
    name: 'getAllTeachersResponse',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      teachers: { type: GraphQLList(TeacherType) }
    })
  }),
  args: {},
  async resolve (parent, args, context) {
    return (async (args) => {
      try {
        const teachers = await Teacher.find()
        return { status: 200, success: 'Successfully get Teacher', teachers }
      } catch (err) {
        return { status: 400, error: err }
      }
    })(args)
  }
}

module.exports = {
  getTeacherById,
  getAllTeachers
}
