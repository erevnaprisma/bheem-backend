const graphql = require('graphql')

const {
  CreateMeetingType,
  FinishMeetingType,
  AddHostType,
  HostRemoveParticipantType,
  RequestToJoinType,
  ShowParticipantThatRequestType,
  AllowParticipantToJoinType,
} = require('../type/meetingType')

// Meeting
const { createMeetingService, finishMeetingService, showParticipantsThatRequestService, requestToJoinMeetingService, addHostService, hostRemoveParticipantService, allowParticipantToJoinService } = require('../../services/Meeting')

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
    endDate: { type: GraphQLString },
    permissionToJoin: { type: GraphQLString }
  },
  resolve (parent, args) {
    return createMeetingService(args.title, args.host, args.createdBy, args.startDate, args.endDate, args.permissionToJoin)
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

const allowParticipantToJoin = {
  type: AllowParticipantToJoinType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return allowParticipantToJoinService(args.meetingId, args.userId)
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

const requestTojoinMeeting = {
  type: RequestToJoinType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return requestToJoinMeetingService(args.meetingId, args.userId)
  }
}

const showParticipantThatRequest = {
  type: ShowParticipantThatRequestType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return showParticipantsThatRequestService(args.meetingId)
  }
}

module.exports = {
  createMeeting,
  finishMeeting,
  addHost,
  hostRemoveParticipants,
  requestTojoinMeeting,
  showParticipantThatRequest,
  allowParticipantToJoin
}
