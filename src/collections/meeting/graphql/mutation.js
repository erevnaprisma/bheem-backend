const graphql = require('graphql')

const { CreateMeetingType, FinishMeetingType } = require('../graphql/type')
const { createMeetingService, finishMeetingService } = require('../services')

const {
  GraphQLString,
  GraphQLNonNull
} = graphql

const createMeeting = {
  type: CreateMeetingType,
  args: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    host: { type: new GraphQLNonNull(GraphQLString) },
    createdBy: { type: new GraphQLNonNull(GraphQLString) },
    startDate: { type: new GraphQLNonNull(GraphQLString) },
    endDate: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return createMeetingService(args.title, args.host, args.createdBy, args.startDate, args.endDate)
  }
}

const finishMeeting = {
  type: FinishMeetingType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return finishMeetingService(args.meetingId)
  }
}

module.exports = {
  createMeeting,
  finishMeeting
}
