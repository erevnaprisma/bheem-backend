const graphql = require('graphql')

const {
  CreateMeetingType,
  FinishMeetingType,
  AddHostType,
  HostRemoveParticipantType,
  RequestToJoinType,
  ShowParticipantThatRequestType,
  AdmitParticipantToJoinType,
  IsMeetingExistType,
  TestingPurposeOnlyType,
  IsUserHostType,
  RemoveUserFromParticipantsType,
  LockMeetingType
} = require('../type/meetingType')

// Meeting
const {
  createMeetingService,
  finishMeetingService,
  showParticipantsThatRequestService,
  requestToJoinMeetingService,
  addHostService,
  hostRemoveParticipantService,
  admitParticipantToJoinService,
  isMeetingExistService,
  testingPurposeOnlyService,
  isUserHostService,
  removeUserFromParticipantsService,
  lockMeetingService
} = require('../../services/Meeting')

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

const admitParticipantToJoin = {
  type: AdmitParticipantToJoinType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    hostId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return admitParticipantToJoinService(args.meetingId, args.userId, args.hostId)
  }
}

const addHost = {
  type: AddHostType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    hostId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return addHostService(args.meetingId, args.userId, args.hostId)
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

const isMeetingExist = {
  type: IsMeetingExistType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return isMeetingExistService(args.meetingId)
  }
}

const isUserHost = {
  type: IsUserHostType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    meetingId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return isUserHostService(args.userId, args.meetingId)
  }
}

const testingPurposeOnly = {
  type: TestingPurposeOnlyType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return testingPurposeOnlyService(args.id)
  }
}

const removeUserFromParticipants = {
  type: RemoveUserFromParticipantsType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    meetingId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return removeUserFromParticipantsService(args.userId, args.meetingId)
  }
}

const lockMeeting = {
  type: LockMeetingType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return lockMeetingService(args.meetingId)
  }
}

module.exports = {
  createMeeting,
  finishMeeting,
  addHost,
  hostRemoveParticipants,
  requestTojoinMeeting,
  showParticipantThatRequest,
  admitParticipantToJoin,
  isMeetingExist,
  testingPurposeOnly,
  isUserHost,
  removeUserFromParticipants,
  lockMeeting
}
