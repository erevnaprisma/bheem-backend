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

const CreateMeetingType = new GraphQLObjectType({
  name: 'CreateMeeting',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    title: { type: GraphQLString },
    host: { type: GraphQLString },
    createdBy: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    meetingId: { type: GraphQLString },
    permissionToJoin: { type: GraphQLString }
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

const AllowParticipantToJoinType = new GraphQLObjectType({
  name: 'AllowParticipantToJoin',
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

const CreateScheduleMeetingType = new GraphQLObjectType({
  name: 'createScheduleMeeting',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    title: { type: GraphQLString },
    host: { type: GraphQLString },
    createdBy: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    meetingId: { type: GraphQLString }
  })
})

module.exports = {
  CreateMeetingType,
  FinishMeetingType,
  AllowParticipantToJoinType,
  AddHostType,
  HostRemoveParticipantType,
  ShowParticipantThatRequestType,
  RequestToJoinType,
  CreateScheduleMeetingType
}
