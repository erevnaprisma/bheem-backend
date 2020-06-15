const {
  GraphQLNonNull,
  GraphQLString
} = require('graphql')

// Type
const { CreateScheduleMeetingType, CancelScheduleMeetingType, ShowScheduleMeetingType } = require('../type/scheduleMeetingType')

// services
const { createScheduleMeetingService, cancelScheduleMeetingService, showScheduleMeetingsService } = require('../../services/ScheduleMeeting')

const createScheduleMeeting = {
  type: CreateScheduleMeetingType,
  args: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    host: { type: new GraphQLNonNull(GraphQLString) },
    createdBy: { type: new GraphQLNonNull(GraphQLString) },
    startDate: { type: new GraphQLNonNull(GraphQLString) },
    endDate: { type: GraphQLString },
    permissionToJoin: { type: GraphQLString }
  },
  resolve (parent, args) {
    return createScheduleMeetingService(args.title, args.host, args.createdBy, args.startDate, args.endDate, args.permissionToJoin)
  }
}

const cancelScheduleMeeting = {
  type: CancelScheduleMeetingType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return cancelScheduleMeetingService(args.meetingId)
  }
}

const showScheduleMeeting = {
  type: ShowScheduleMeetingType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return showScheduleMeetingsService(args.userId)
  }
}

module.exports = {
  createScheduleMeeting,
  cancelScheduleMeeting,
  showScheduleMeeting
}
