const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList
} = graphql

const CreateScheduleMeetingType = new GraphQLObjectType({
  name: 'CreateScheduleMeeting',
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

const CancelScheduleMeetingType = new GraphQLObjectType({
  name: 'CancelScheduleMeetingType',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

module.exports = {
  CreateScheduleMeetingType,
  CancelScheduleMeetingType
}
