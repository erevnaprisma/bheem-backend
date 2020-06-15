const graphql = require('graphql')

// User
const { login, logout, signUp } = require('./src/collections/user/graphql/mutation')
const { getAllUser } = require('./src/collections/user/graphql/query')

// Meeting
const { createMeeting, finishMeeting, addHost, hostRemoveParticipants, requestTojoinMeeting, showParticipantThatRequest, allowParticipantToJoin } = require('./src/collections/meeting/graphql/mutation/meetingMutation')

// Schedule Meeting
const { createScheduleMeeting, cancelScheduleMeeting, showScheduleMeeting, startScheduleMeeting } = require('./src/collections/meeting/graphql/mutation/scheduleMeetingMutation')

const {
  GraphQLObjectType,
  GraphQLSchema
} = graphql

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getAllUser
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // auth
    signUp,
    login,
    logout,

    // meeting
    createMeeting,
    finishMeeting,
    addHost,
    hostRemoveParticipants,
    requestTojoinMeeting,
    showParticipantThatRequest,
    allowParticipantToJoin,

    // schedule meeting
    createScheduleMeeting,
    cancelScheduleMeeting,
    showScheduleMeeting,
    startScheduleMeeting
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
