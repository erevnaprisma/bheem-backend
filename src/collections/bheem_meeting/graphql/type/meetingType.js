const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList
} = graphql

const ParticipantThatRequestType = new GraphQLObjectType({
  name: 'ParticipantThatRequest',
  fields: () => ({
    userId: { type: GraphQLString },
    name: { type: GraphQLString }
  })
})

const HostType = new GraphQLObjectType({
  name: 'Host',
  fields: () => ({
    userId: { type: GraphQLString }
  })
})

const MeetingType = new GraphQLObjectType({
  name: 'Meeting',
  fields: () => ({
    title: { type: GraphQLString },
    hosts: { type: GraphQLList(HostType) },
    createdBy: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    id: { type: GraphQLString },
    needPermisionToJoin: { type: GraphQLString }
  })
})

const CreateMeetingType = new GraphQLObjectType({
  name: 'CreateMeeting',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    meeting: { type: MeetingType }
  })
})

const FinishMeetingType = new GraphQLObjectType({
  name: 'FinishMeeting',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const AdmitParticipantToJoinType = new GraphQLObjectType({
  name: 'AdmitParticipantToJoin',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const AddHostType = new GraphQLObjectType({
  name: 'AddHost',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const HostRemoveParticipantType = new GraphQLObjectType({
  name: 'HostRemoveParticipant',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const ShowParticipantThatRequestType = new GraphQLObjectType({
  name: 'ShowParticipantThatRequest',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    participants: { type: GraphQLList(ParticipantThatRequestType) }
  })
})

const RequestToJoinType = new GraphQLObjectType({
  name: 'RequestToJoin',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const IsMeetingExistType = new GraphQLObjectType({
  name: 'isMeetingExist',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    meeting: { type: MeetingType }
  })
})

const TestingPurposeOnlyType = new GraphQLObjectType({
  name: 'TestingPurposeOnly',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const IsUserHostType = new GraphQLObjectType({
  name: 'IsUserHost',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    isUserHost: { type: GraphQLString }
  })
})

const RemoveUserFromParticipantsType = new GraphQLObjectType({
  name: 'RemoveUserFromParticipants',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const LockMeetingType = new GraphQLObjectType({
  name: 'LockMeeting',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const SingleUserMeetingListType = new GraphQLObjectType({
  name: 'SingleUserMeetingList',
  fields: () => ({
    fullName: { type: GraphQLString },
    role: { type: GraphQLString },
    userId: { type: GraphQLString }
  })
})

const GetCurrentMeetingListType = new GraphQLObjectType({
  name: 'GetCurrentMeetingList',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    meetingList: { type: GraphQLList(SingleUserMeetingListType) }
  })
})

const MeetingHistoryType = new GraphQLObjectType({
  name: 'MeetingHistory',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    meetingList: { type: GraphQLList(MeetingType) }
  })
})

module.exports = {
  MeetingType,
  CreateMeetingType,
  FinishMeetingType,
  AdmitParticipantToJoinType,
  AddHostType,
  HostRemoveParticipantType,
  ShowParticipantThatRequestType,
  RequestToJoinType,
  IsMeetingExistType,
  TestingPurposeOnlyType,
  IsUserHostType,
  RemoveUserFromParticipantsType,
  LockMeetingType,
  GetCurrentMeetingListType,
  MeetingHistoryType
}
