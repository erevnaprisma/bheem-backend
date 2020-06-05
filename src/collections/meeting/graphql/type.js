const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLObjectType
} = graphql

// const MeetingType = new GraphQLObjectType({
//   name: 'Meeting',
//   fields: () => ({
//     userId: { type: GraphQLString },
//     username: { type: GraphQLString },
//     fullName: { type: GraphQLString },
//     email: { type: GraphQLString },
//     password: { type: GraphQLString },
//     deviceId: { type: GraphQLString },
//     firstName: { type: GraphQLString },
//     lastName: { type: GraphQLString },
//     nickname: { type: GraphQLString },
//     address: { type: GraphQLString },
//     profilePicture: { type: GraphQLString },
//     createdAt: { type: GraphQLString },
//     updatedAt: { type: GraphQLString }
//   })
// })

const CreateMeetingType = new GraphQLObjectType({
  name: 'CreateMeeting',
  fields: () => ({
    title: { type: GraphQLString },
    invitationMessage: { type: GraphQLString },
    host: { type: String },
    createdBy: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    createdAt: { type: String },
    updatedAt: { type: String }
  })
})

module.exports = {
  CreateMeetingType
}
