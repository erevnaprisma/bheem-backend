const graphql = require('graphql')

// User
const { login, logout, signUp, changePassword } = require('./src/collections/user/graphql/mutation')
const { getAllUser } = require('./src/collections/user/graphql/query')

// Meeting
const {
  createMeeting,
  finishMeeting,
  addHost,
  hostRemoveParticipants,
  requestTojoinMeeting,
  showParticipantThatRequest,
  allowParticipantToJoin,
  isMeetingExist
} = require('./src/collections/meeting/graphql/mutation/meetingMutation')

// Schedule Meeting
const { createScheduleMeeting, cancelScheduleMeeting, showScheduleMeeting, startScheduleMeeting, editScheduleMeeting } = require('./src/collections/meeting/graphql/mutation/scheduleMeetingMutation')

// Anonymous Meeting
const { anonymousRequestTojoinMeeting } = require('./src/collections/meeting/graphql/mutation/anonymousMeetingMutation')

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
    changePassword,

    // meeting
    createMeeting,
    finishMeeting,
    addHost,
    hostRemoveParticipants,
    requestTojoinMeeting,
    showParticipantThatRequest,
    allowParticipantToJoin,
    isMeetingExist,

    // schedule meeting
    createScheduleMeeting,
    cancelScheduleMeeting,
    showScheduleMeeting,
    startScheduleMeeting,
    editScheduleMeeting,

    // anonymous meeting
    anonymousRequestTojoinMeeting
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
