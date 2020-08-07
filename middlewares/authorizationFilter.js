const jwt = require('jsonwebtoken')
const config = require('config')
const { fetchDetailUserRoleByUserId } = require('../src/collections/user_role/services')
const { flatten } = require('../src/utils/services')
const _ = require('lodash')

const authorizationFilter = async (resolve, parent, args, context, info) => {
  console.log('authorizationFilter ===>', info.fieldName)
  // console.log('context.req.headers===>', context.req.headers)
  const { accesstoken } = context.req.headers
  const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
  const { user_id: userId } = bodyAt
  // authorization
  const userRole = await fetchDetailUserRoleByUserId(userId)
  const userPrivilegeName = flatten(_.map(userRole.data_detail.role_id, (v, i) => _.map(v.privilege_id, (v, i) => v.name)) || [])
  // console.log('list of my privilege: ', userPrivilegeName)
  if (!userPrivilegeName.includes(info.fieldName)) {
    // not authorized
    throw new Error('NOT_AUTHORIZED ' + info.fieldName)
  }
  // if (!args.access_token) return { status: 400, error: 'Token needed' }
  // const at = await jwt.verify(accesstoken, config.get('privateKeyMerchant'))

  // console.log('authorizationFilter middleware at: ', accesstoken)
  // console.log('authorizationFilter middleware at: ', at)
  const result = resolve(parent, args, context, info)
  return result
}
const authorizationFilterMiddleware = {
  Mutation: {
    // course
    createCourse: authorizationFilter,
    deleteCourse: authorizationFilter,
    updateCourse: authorizationFilter,
    // subject
    createSubject: authorizationFilter,
    updateSubject: authorizationFilter,
    deleteSubject: authorizationFilter,
    // subject unit
    createLmsSubjectUnit: authorizationFilter,
    updateLmsSubjectUnit: authorizationFilter,
    deleteLmsSubjectUnit: authorizationFilter,
    // enrollment
    submitCourseEnrollmentRequest: authorizationFilter,

    // RAYAPAY

    // merchant
    signUpMerchant: authorizationFilter,
    logoutMerchant: authorizationFilter,
    relationMerchantInstitution: authorizationFilter,
    changePasswordMerchant: authorizationFilter,
    // institution
    logoutInstitution: authorizationFilter,
    signUpInstitution: authorizationFilter,
    // qr
    createQrStatic: authorizationFilter,
    testing: authorizationFilter,
    createQrDynamic: authorizationFilter,
    // fee
    addFee: authorizationFilter,
    setMerchantFee: authorizationFilter,
    setInstitutionFee: authorizationFilter,
    // settlement
    setSettlement: authorizationFilter,
    // otp
    sendOtp: authorizationFilter,
    submitOtp: authorizationFilter,
    changePasswordViaForgetPassword: authorizationFilter,
    forgetPasswordSendOtp: authorizationFilter,
    merchantForgetPassword: authorizationFilter,
    merchantSubmitForgetPassword: authorizationFilter,
    institutionForgetPassword: authorizationFilter,
    institutionSubmitForgetPassword: authorizationFilter,
    // services
    topupVa: authorizationFilter,
    staticQrPayment: authorizationFilter,
    scanQrStatic: authorizationFilter,
    detailPayment: authorizationFilter,
    cancelStaticPayment: authorizationFilter,
    transactionReceipt: authorizationFilter,
    topupInstitution: authorizationFilter,
    dynamicQrPayment: authorizationFilter,
    scanQrDynamic: authorizationFilter,
    createQrTopUpMerchant: authorizationFilter,
    scanQrTopUpMerchant: authorizationFilter,
    paymentTopUpMerchant: authorizationFilter,
    // user
    // signUp: authorizationFilter,
    // signUpV2: authorizationFilter,
    // changeUserPassword: authorizationFilter,
    // changeUserName: authorizationFilter,
    // changeUserProfile: authorizationFilter,
    // logout: authorizationFilter,
    // role
    createRole: authorizationFilter,
    updateRole: authorizationFilter,
    deleteRole: authorizationFilter,
    // role privilege
    createRoleprivilege: authorizationFilter,
    updateRoleprivilege: authorizationFilter,
    deleteRoleprivilege: authorizationFilter,
    // privilege
    // createPrivilege: authorizationFilter,
    updatePrivilege: authorizationFilter,
    deletePrivilege: authorizationFilter,
    privilegeCheckboxSubmit: authorizationFilter,
    // user role
    createUserRole: authorizationFilter,
    updateUserRole: authorizationFilter,
    deleteUserRole: authorizationFilter,
    // lms grading
    createLmsGrading: authorizationFilter,
    updateLmsGrading: authorizationFilter,
    deleteLmsGrading: authorizationFilter
  },
  RootQueryType: {
    // enrollment
    getAllEnrollmentUserByCourseId: authorizationFilter,
    getAllEnrollmentUserByFilter: authorizationFilter,
    // teacher
    getTeacherById: authorizationFilter,
    getAllTeachers: authorizationFilter,
    // course
    getCourseById: authorizationFilter,
    getAllCourses: authorizationFilter,
    getDetailCourse: authorizationFilter,
    getAllPublishedCourses: authorizationFilter,
    getDetailPublishedCourse: authorizationFilter,
    // subject
    getAllSubjects: authorizationFilter,
    getDetailSubject: authorizationFilter,
    // subject unit
    getAllLmsSubjectUnits: authorizationFilter,
    getDetailLmsSubjectUnit: authorizationFilter,
    // RAYAPAY
    // emoney
    allTransaction: authorizationFilter,
    // merchant
    AllMerchant: authorizationFilter,
    MerchantInfo: authorizationFilter,
    loginMerchant: authorizationFilter,
    MerchantTransactionHistory: authorizationFilter,
    merchantDashboard: authorizationFilter,
    showRelatedInstitution: authorizationFilter,
    // institution
    AllInstitution: authorizationFilter,
    loginInstitution: authorizationFilter,
    InstitutionInfo: authorizationFilter,
    // qr
    showQR: authorizationFilter,

    // settlement
    getAllSettlement: authorizationFilter,
    getSettlements: authorizationFilter,

    // services
    transactionHistory: authorizationFilter,

    // user
    // login: authorizationFilter,
    getProfile: authorizationFilter,
    allUser: authorizationFilter,
    getAllUsers: authorizationFilter,
    getDetailUser: authorizationFilter,
    // role
    getAllRoles: authorizationFilter,
    getDetailRole: authorizationFilter,

    // role privilege
    getAllRoleprivilegesByRoleId: authorizationFilter,
    getDetailRoleprivilege: authorizationFilter,

    // privilege
    getAllPrivileges: authorizationFilter,
    getDetailPrivilege: authorizationFilter,

    // user role
    getAllUserRoles: authorizationFilter,
    getDetailUserRole: authorizationFilter,
    getDetailUserRoleByMyUserId: authorizationFilter,

    // lms grading
    getAllLmsGradings: authorizationFilter,
    getDetailLmsGrading: authorizationFilter,
    getAllGradingsByCourseId: authorizationFilter
  }
}
module.exports = authorizationFilterMiddleware
