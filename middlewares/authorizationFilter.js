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
  console.log('list of my privilege: ', userPrivilegeName)
  if (!userPrivilegeName.includes(info.fieldName)) {
    // not authorized
    throw new Error('NOT_AUTHORIZED ' + info.fieldName)
  }
  // if (!args.access_token) return { status: 400, error: 'Token needed' }
  // const at = await jwt.verify(accesstoken, config.get('privateKeyMerchant'))

  console.log('authorizationFilter middleware at: ', accesstoken)
  // console.log('authorizationFilter middleware at: ', at)
  const result = resolve(parent, args, context, info)
  return result
}
const authorizationFilterMiddleware = {
  Mutation: {
    createCourse: authorizationFilter,
    deleteCourse: authorizationFilter,
    updateCourse: authorizationFilter,
    createSubject: authorizationFilter,
    updateSubject: authorizationFilter,
    deleteSubject: authorizationFilter,
    createLmsSubjectUnit: authorizationFilter,
    updateLmsSubjectUnit: authorizationFilter,
    deleteLmsSubjectUnit: authorizationFilter,
    submitCourseEnrollmentRequest: authorizationFilter
  },
  RootQueryType: {
    getAllCourses: authorizationFilter,
    getDetailCourse: authorizationFilter,
    getAllSubjects: authorizationFilter,
    getDetailSubject: authorizationFilter,
    getAllLmsSubjectUnits: authorizationFilter,
    getDetailLmsSubjectUnit: authorizationFilter
  }
}
module.exports = authorizationFilterMiddleware
