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
  admitParticipantToJoin,
  isMeetingExist,
  testingPurposeOnly,
  isUserHost
} = require('./src/collections/meeting/graphql/mutation/meetingMutation')

// Schedule Meeting
const {
  createScheduleMeeting,
  cancelScheduleMeeting,
  showScheduleMeeting,
  startScheduleMeeting,
  editScheduleMeeting
} = require('./src/collections/meeting/graphql/mutation/scheduleMeetingMutation')

// Anonymous Meeting
const { anonymousRequestTojoinMeeting } = require('./src/collections/meeting/graphql/mutation/anonymousMeetingMutation')

// Plan
const { createPlan, getSelectedPlan, deletePlan } = require('./src/collections/plan/graphql/mutation')
const { getAllPlan } = require('./src/collections/plan/graphql/query')

const {
  GraphQLObjectType,
  GraphQLSchema
} = graphql

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // user
    getAllUser,

    // plan
    getAllPlan
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
    admitParticipantToJoin,
    isMeetingExist,
    testingPurposeOnly,
    isUserHost,

    // schedule meeting
    createScheduleMeeting,
    cancelScheduleMeeting,
    showScheduleMeeting,
    startScheduleMeeting,
    editScheduleMeeting,

    // anonymous meeting
    anonymousRequestTojoinMeeting,

    // plan
    createPlan,
    getSelectedPlan,
    deletePlan
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
