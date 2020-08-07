const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const Role = require('./Model')
const User = require('../user/Model')
const { CommandCursor } = require('mongodb')
const fetchAllRoles = async (args, context) => {
  console.log('fetchAllRoles invoked')
  try {
    const filter = {}
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    filter.$and = [{ created_by: userId }]
    if (!_.isEmpty(args.string_to_search)) {
      filter.$and.push({
        $or: [
          { title: { $regex: args.string_to_search, $options: 'i' } }
        ]
      })
    }
    console.log('filter======', filter)
    const result = await Role.find(filter).sort({ updated_at: 'desc' }).skip(args.page_index * args.page_size).limit(args.page_size).populate({ path: 'created_by' }).populate({ path: 'updated_by' })
    const count = await Role.countDocuments(filter)
    const pageCount = await Math.ceil(count / args.page_size)
    return { status: 200, success: 'Successfully get all Data', list_data: result, count, page_count: pageCount }
  } catch (err) {
    console.log('err=> ', err)
    return { status: 400, error: err }
  }
}
const fetchDetailRole = async (args, context) => {
  console.log('fetchDetailRole invoked')
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const result = await Role.findOne({ _id: args.id }).populate({ path: 'created_by' }).populate({ path: 'updated_by' }).populate({ path: 'privilege_id' })
    return { status: 200, success: 'Successfully get Data', data_detail: result }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const doCreateRole = async (args, context) => {
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
    console.log('create course=> ', data)
    return { status: 200, success: 'Successfully save Data', detail_data: await Role.create(data) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doUpdateRole = async (args, context) => {
  try {
    const now = Date.now()
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const userDetail = await User.findById(userId)

    const dataUpdate = {}
    dataUpdate.updated_by = userDetail._id
    dataUpdate.updated_at = now
    if (args.title) dataUpdate.title = args.title
    if (args.description) dataUpdate.description = args.description

    const updateRoleResp = await Role.findByIdAndUpdate(args._id, dataUpdate)
    return { status: 200, success: 'Successfully save Data', detail_data: updateRoleResp }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doDeleteRole = async (args, context) => {
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    console.log('delete invoked')

    return { status: 200, success: 'Successfully delete Data', detail_data: await Role.remove({ _id: args._id, created_by: userId }) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}

module.exports = {
  fetchAllRoles,
  fetchDetailRole,
  doCreateRole,
  doUpdateRole,
  doDeleteRole
}
