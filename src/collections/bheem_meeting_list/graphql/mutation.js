const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean
} = require('graphql')

// services
const { createMeetingListService } = require('../services')

// types
const { CreateMeetingListType } = require('../graphql/type')

const createMeetingList = {
  type: CreateMeetingListType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    audio: { type: new GraphQLNonNull(GraphQLBoolean) },
    video: { type: new GraphQLNonNull(GraphQLBoolean) },
    socketId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return createMeetingListService(args.meetingId, args.userId, args.audio, args.video, args.socketId)
  }
}

module.exports = {
  createMeetingList
}
