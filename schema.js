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
} = require('./src/collections/bheem-meeting/graphql/mutation/meetingMutation')

// Schedule Meeting
const {
  createScheduleMeeting,
  cancelScheduleMeeting,
  showScheduleMeeting,
  startScheduleMeeting,
  editScheduleMeeting
} = require('./src/collections/bheem-meeting/graphql/mutation/scheduleMeetingMutation')

// Anonymous Meeting
const { anonymousRequestTojoinMeeting } = require('./src/collections/bheem-meeting/graphql/mutation/anonymousMeetingMutation')

// Plan
const { createPlan, getSelectedPlan, deletePlan } = require('./src/collections/bheem-plan/graphql/mutation')
const { getAllPlan } = require('./src/collections/bheem-plan/graphql/query')

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

// RAYAPAY
// Emoney
const { allTransaction } = require('./src/collections/rp-emoney/graphql/query')

// Merchant
const { signUpMerchant, logoutMerchant, relationMerchantInstitution, changePasswordMerchant } = require('./src/collections/rp-merchant/graphql/mutation')
const { AllMerchant, MerchantInfo, loginMerchant, MerchantTransactionHistory, merchantDashboard, showRelatedInstitution } = require('./src/collections/rp-merchant/graphql/query')

// Institution
const { logoutInstitution, signUpInstitution } = require('./src/collections/rp-institution/graphql/mutation')
const { AllInstitution, loginInstitution, InstitutionInfo } = require('./src/collections/rp-institution/graphql/query')

// Qr
const { createQrStatic, testing, createQrDynamic } = require('./src/collections/rp-qr/graphql/mutation')
const { showQR } = require('./src/collections/rp-qr/graphql/query')

// Fee
const { addFee, setMerchantFee, setInstitutionFee } = require('./src/collections/rp-fee/graphql/mutation')

// Settlement
const { setSettlement } = require('./src/collections/rp-settlement/graphql/mutation')
const { getAllSettlement, getSettlements } = require('./src/collections/rp-settlement/graphql/query')

// Otp
const {
  sendOtp,
  submitOtp,
  changePasswordViaForgetPassword,
  forgetPasswordSendOtp,
  merchantForgetPassword,
  merchantSubmitForgetPassword,
  institutionForgetPassword,
  institutionSubmitForgetPassword
} = require('./src/collections/rp-otp/graphql/mutation')

// Services
const { topupVa, staticQrPayment, scanQrStatic, detailPayment, cancelStaticPayment, transactionReceipt, topupInstitution, dynamicQrPayment, scanQrDynamic, createQrTopUpMerchant, scanQrTopUpMerchant, paymentTopUpMerchant } = require('./src/services/graphql/mutation')
const { transactionHistory } = require('./src/services/graphql/query')

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
    getDetailLmsSubjectUnit,

    // RAYAPAY
    // emoney
    allTransaction,

    // merchant
    AllMerchant,
    MerchantInfo,
    loginMerchant,
    MerchantTransactionHistory,
    merchantDashboard,
    showRelatedInstitution,

    // institution
    AllInstitution,
    loginInstitution,
    InstitutionInfo,

    // qr
    showQR,

    // settlement
    getAllSettlement,
    getSettlements,

    // services
    transactionHistory
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
    deleteLmsSubjectUnit,

    // RAYAPAY

    // merchant
    signUpMerchant,
    logoutMerchant,
    relationMerchantInstitution,
    changePasswordMerchant,

    // institution
    logoutInstitution,
    signUpInstitution,

    // qr
    createQrStatic,
    testing,
    createQrDynamic,

    // fee
    addFee,
    setMerchantFee,
    setInstitutionFee,

    // settlement
    setSettlement,

    // otp
    sendOtp,
    submitOtp,
    changePasswordViaForgetPassword,
    forgetPasswordSendOtp,
    merchantForgetPassword,
    merchantSubmitForgetPassword,
    institutionForgetPassword,
    institutionSubmitForgetPassword,

    // services
    topupVa,
    staticQrPayment,
    scanQrStatic,
    detailPayment,
    cancelStaticPayment,
    transactionReceipt,
    topupInstitution,
    dynamicQrPayment,
    scanQrDynamic,
    createQrTopUpMerchant,
    scanQrTopUpMerchant,
    paymentTopUpMerchant
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
