const graphql = require('graphql')

// BHEEM

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
  isUserHost,
  removeUserFromParticipants
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

// LMS

// Teacher
const { createTeacher } = require('./src/collections/lms-teacher/graphql/mutation')
const { getTeacherById, getAllTeachers } = require('./src/collections/lms-teacher/graphql/query')

// Course
const { createCourse, updateCourse, deleteCourse } = require('./src/collections/lms-course/graphql/mutation')
const { getCourseById, getAllCourses, getDetailCourse } = require('./src/collections/lms-course/graphql/query')

// Subject
const { createSubject, updateSubject, deleteSubject } = require('./src/collections/lms-subject/graphql/mutation')
const { getAllSubjects, getDetailSubject } = require('./src/collections/lms-subject/graphql/query')

// Subject Unit
const { createLmsSubjectUnit, updateLmsSubjectUnit, deleteLmsSubjectUnit } = require('./src/collections/lms_subject_unit/graphql/mutation')
const { getAllLmsSubjectUnits, getDetailLmsSubjectUnit } = require('./src/collections/lms_subject_unit/graphql/query')
// const { getAllSettlement, getSettlements } = require('./src/collections/settlement/graphql/query')

// const { tablepaginationFetchData } = require('./src/services/graphql/query')

const {
  GraphQLObjectType,
  GraphQLSchema
} = graphql

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // BHEEM
    // user
    getAllUser,

    // plan
    getAllPlan,

    // LMS
    // teacher
    getTeacherById,
    getAllTeachers,

    // course
    getCourseById,
    getAllCourses,
    getDetailCourse,

    // subject
    getAllSubjects,
    getDetailSubject,

    // subject unit
    getAllLmsSubjectUnits,
    getDetailLmsSubjectUnit
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // BHEEM
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
    removeUserFromParticipants,

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
    deletePlan,

    // LMS
    // teacher
    createTeacher,

    // course
    createCourse,
    updateCourse,
    deleteCourse,

    // subject
    createSubject,
    updateSubject,
    deleteSubject,

    // subject unit
    createLmsSubjectUnit,
    updateLmsSubjectUnit,
    deleteLmsSubjectUnit
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
