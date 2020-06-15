const graphql = require('graphql')
const { MeetingType } = require('./meetingType')

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
    meeting: { type: MeetingType }
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
