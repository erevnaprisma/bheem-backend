const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLObjectType
} = graphql

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
    meetingId: { type: GraphQLString }
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

const AddParticipantType = new GraphQLObjectType({
  name: 'AddParticipant',
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

module.exports = {
  CreateMeetingType,
  FinishMeetingType,
  AddParticipantType,
  AddHostType
}
