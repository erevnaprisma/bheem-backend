const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLList
} = graphql

const ArrayMeetingList = new GraphQLObjectType({
  name: 'ArrayMeetingList',
  fields: () => ({
    userId: { type: GraphQLString },
    audio: { type: GraphQLBoolean },
    video: { type: GraphQLBoolean },
    socketId: { type: GraphQLString }
  })
})

const MeetingList = new GraphQLObjectType({
  name: 'MeetingList',
  fields: () => ({
    meetingId: { type: GraphQLString },
    meetingList: { type: GraphQLList(ArrayMeetingList) }
  })
})

const CreateMeetingListType = new GraphQLObjectType({
  name: 'CreateMeetingList',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    meetingList: { type: MeetingList }
  })
})

module.exports = {
  CreateMeetingListType
}
