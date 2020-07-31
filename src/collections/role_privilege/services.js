const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const Roleprivilege = require('./Model')
const User = require('../user/Model')
const fetchAllRoleprivilegesByRoleId = async (args, context) => {
  console.log('fetchAllRoleprivilegesByRoleId invoked')
  try {
    const filter = {}
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    filter.$and = [{ role_id: args.role_id }]
    if (!_.isEmpty(args.string_to_search)) {
      filter.$and.push({
        $or: [
          { title: { $regex: args.string_to_search, $options: 'i' } }
        ]
      })
    }
    console.log('filter======', filter)
    const result = await Roleprivilege.find(filter).sort({ updated_at: 'desc' }).skip(args.page_index * args.page_size).limit(args.page_size)
      .populate({ path: 'role_id', populate: { path: 'privilege_id' } })
      .populate({ path: 'created_by' })
      .populate({ path: 'updated_by' })
    const count = await Roleprivilege.countDocuments(filter)
    const pageCount = await Math.ceil(count / args.page_size)
    return { status: 200, success: 'Successfully get all Data', list_data: result, count, page_count: pageCount }
  } catch (err) {
    console.log('err=> ', err)
    return { status: 400, error: err }
  }
}
const fetchDetailRoleprivilege = async (args, context) => {
  console.log('fetchDetailRoleprivilege invoked')
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const result = await Roleprivilege.findOne({ _id: args.id, created_by: userId }).populate({ path: 'created_by' }).populate({ path: 'updated_by' })
    return { status: 200, success: 'Successfully get Data', data_detail: result }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const doCreateRoleprivilege = async (args, context, { opts }) => {
  try {
    const now = Date.now()
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const userDetail = await User.findById(userId)
    const data = args
    data.created_by = userDetail._id
    data.updated_by = userDetail._id
    data.created_at = now
    data.updated_at = now
    return { status: 200, success: 'Successfully save Data', detail_data: await Roleprivilege.create(data, opts) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doUpdateRoleprivilege = async (args, context) => {
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
    return { status: 200, success: 'Successfully save Data', detail_data: await Roleprivilege.findOneAndUpdate({ _id: args._id, created_by: userId }, data).populate({ path: 'created_by' }).populate({ path: 'updated_by' }) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doDeleteRoleprivilege = async (args, context) => {
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    console.log('delete invoked')
    return { status: 200, success: 'Successfully delete Data', detail_data: await Roleprivilege.remove({ _id: args._id, created_by: userId }) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doDeleteRoleprivilegeByPrivilegeId = async ({ opts, args }) => {
  try {
    console.log('doDeleteRoleprivilegeByPrivilegeId invoked')
    await Roleprivilege.remove({ privilege_id: args.privilege_id }).session(opts.session)
    return { status: 200, success: 'Successfully delete Data', detail_data: {} }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}

module.exports = {
  fetchAllRoleprivilegesByRoleId,
  fetchDetailRoleprivilege,
  doCreateRoleprivilege,
  doUpdateRoleprivilege,
  doDeleteRoleprivilege,
  doDeleteRoleprivilegeByPrivilegeId
}
