const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const UserRole = require('./Model')
const User = require('../user/Model')
const fetchAllUserRoles = async (args, context) => {
  console.log('fetchAllUserRoles invoked')
  try {
    const filter = {}
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    filter.created_by = userId
    // filter.$and = [{ user_id: userId }]
    // if (!_.isEmpty(args.string_to_search)) {
    //   filter.$and.push({
    //     $or: [
    //       { title: { $regex: args.string_to_search, $options: 'i' } }
    //     ]
    //   })
    // }
    console.log('filter======', filter)
    const result = await UserRole.find(filter).sort({ updated_at: 'desc' }).skip(args.page_index * args.page_size).limit(args.page_size)
      .populate({ path: 'user_id' })
      .populate({ path: 'role_id', populate: { path: 'privilege_id' } })
      .populate({ path: 'created_by' })
      .populate({ path: 'updated_by' })

    const count = await UserRole.countDocuments(filter)
    const pageCount = await Math.ceil(count / args.page_size)
    return { status: 200, success: 'Successfully get all Data', list_data: result, count, page_count: pageCount }
  } catch (err) {
    console.log('err=> ', err)
    return { status: 400, error: err }
  }
}
const fetchDetailUserRole = async (args, context) => {
  console.log('fetchDetailUserRole invoked')
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const result = await UserRole.findOne({ _id: args.id, created_by: userId })
      .populate({ path: 'user_id' })
      .populate({ path: 'role_id', populate: { path: 'privilege_id' } })
      .populate({ path: 'created_by' })
      .populate({ path: 'updated_by' })
    return { status: 200, success: 'Successfully get Data', data_detail: result }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const fetchDetailUserRoleByMyUserId = async (args, context) => {
  console.log('fetchDetailUserRole invoked')
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const result = (await fetchDetailUserRoleByUserId(userId) || {}).data_detail
    return { status: 200, success: 'Successfully get Data', data_detail: result }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const fetchDetailUserRoleByUserId = async (userId) => {
  console.log('fetchDetailUserRole invoked')
  try {
    const result = await UserRole.findOne({ user_id: userId })
      .populate({ path: 'user_id' })
      .populate({ path: 'role_id', populate: { path: 'privilege_id' } })
      .populate({ path: 'created_by' })
      .populate({ path: 'updated_by' })
    return { status: 200, success: 'Successfully get Data', data_detail: result }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const doCreateUserRole = async (args, context, { opts }) => {
  try {
    const now = Date.now()
    // const { accesstoken } = context.req.headers
    // const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    // const { user_id: userId } = bodyAt
    const userDetail = await User.findById(args.user_id)
    const data = args

    data.created_by = userDetail._id
    data.updated_by = userDetail._id
    data.created_at = now
    data.updated_at = now
    console.log('create course=> ', data)
    return { status: 200, success: 'Successfully save Data', detail_data: await (await UserRole.create(data, opts)).populate({ path: 'user_id' }).populate({ path: 'role_id', populate: { path: 'privilege_id' } }).execPopulate() }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doUpdateUserRole = async (args, context) => {
  try {
    const now = Date.now()
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const userDetail = await User.findById(userId)
    const data = args
    // data.created_by = userDetail._id
    data.updated_by = userDetail._id
    // data.created_at = now
    data.updated_at = now
    console.log('update=> ', data)
    return { status: 200, success: 'Successfully save Data', detail_data: await (await UserRole.findOneAndUpdate({ _id: args._id, created_by: userId }, data)).populate({ path: 'user_id' }).populate({ path: 'role_id', populate: { path: 'privilege_id' } }).populate({ path: 'created_by' }).populate({ path: 'updated_by' }).execPopulate() }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doDeleteUserRole = async (args, context) => {
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    console.log('delete invoked')
    return { status: 200, success: 'Successfully delete Data', detail_data: await UserRole.remove({ _id: args._id, created_by: userId }) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}

module.exports = {
  fetchDetailUserRoleByUserId,
  fetchDetailUserRoleByMyUserId,
  fetchAllUserRoles,
  fetchDetailUserRole,
  doCreateUserRole,
  doUpdateUserRole,
  doDeleteUserRole
}
