const {
  GraphQLNonNull,
  GraphQLString
} = require('graphql')

// Type
const { CreateScheduleMeetingType, CancelScheduleMeetingType, ShowScheduleMeetingType, StartScheduleMeetingType, EditScheduleMeetingType } = require('../type/scheduleMeetingType')

// services
const { createScheduleMeetingService, cancelScheduleMeetingService, showScheduleMeetingsService, startScheduleMeetingService, editScheduleMeetingService } = require('../../services/ScheduleMeeting')

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

const startScheduleMeeting = {
  type: StartScheduleMeetingType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return startScheduleMeetingService(args.meetingId)
  }
}

const editScheduleMeeting = {
  type: EditScheduleMeetingType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    permission: { type: new GraphQLNonNull(GraphQLString) },
    startDate: { type: new GraphQLNonNull(GraphQLString) },
    endDate: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return editScheduleMeetingService(args.meetingId, args.title, args.permission, args.startDate, args.endDate)
  }
}

module.exports = {
  createScheduleMeeting,
  cancelScheduleMeeting,
  showScheduleMeeting,
  startScheduleMeeting,
  editScheduleMeeting
}
