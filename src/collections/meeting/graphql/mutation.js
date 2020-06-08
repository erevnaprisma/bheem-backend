const graphql = require('graphql')

const { CreateMeetingType, FinishMeetingType, AddParticipantType, AddHostType, HostRemoveParticipantType } = require('../graphql/type')
const { createMeetingService, finishMeetingService, addParticipantService, addHostService, hostRemoveParticipantService } = require('../services')

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
    endDate: { type: GraphQLString }
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

const addParticipant = {
  type: AddParticipantType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return addParticipantService(args.meetingId, args.userId)
  }
}

const addHost = {
  type: AddHostType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return addHostService(args.meetingId, args.userId)
  }
}

const hostRemoveParticipants = {
  type: HostRemoveParticipantType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) },
    hostId: { type: new GraphQLNonNull(GraphQLString) },
    participantId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return hostRemoveParticipantService(args.meetingId, args.hostId, args.participantId)
  }
}

module.exports = {
  createMeeting,
  finishMeeting,
  addParticipant,
  addHost,
  hostRemoveParticipants
}
