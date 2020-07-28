const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const Course = require('./Model')
const User = require('../user/Model')
const fetchAllCourses = async (args, context) => {
  console.log('fetchAllCourses invoked')
  try {
    const filter = {}
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    filter.$and = [{ created_by: userId }]
    if (!_.isEmpty(args.string_to_search)) {
      filter.$and.push({
        $or: [
          { title: { $regex: args.string_to_search, $options: 'i' } },
          { content1: { $regex: args.string_to_search, $options: 'i' } },
          { content2: { $regex: args.string_to_search, $options: 'i' } },
          { content3: { $regex: args.string_to_search, $options: 'i' } },
          { code: { $regex: args.string_to_search, $options: 'i' } }
        ]
      })
    }
    console.log('filter======', filter)
    const result = await Course.find(filter).sort({ updated_at: 'desc' }).skip(args.page_index * args.page_size).limit(args.page_size).populate({ path: 'created_by' }).populate({ path: 'updated_by' })
    const count = await Course.countDocuments(filter)
    const pageCount = await Math.ceil(count / args.page_size)
    return { status: 200, success: 'Successfully get all Data', list_data: result, count, page_count: pageCount }
  } catch (err) {
    console.log('err=> ', err)
    return { status: 400, error: err }
  }
}
const fetchDetailCourse = async (args, context) => {
  console.log('fetchDetailCourse invoked')
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const result = await Course.findOne({ _id: args.id, created_by: userId }).populate({ path: 'created_by' }).populate({ path: 'updated_by' })
    return { status: 200, success: 'Successfully get Data', data_detail: result }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const doCreateCourse = async (args, context) => {
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
    return { status: 200, success: 'Successfully save Data', detail_data: await Course.create(data) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doUpdateCourse = async (args, context) => {
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
    console.log('update course=> ', data)
    return { status: 200, success: 'Successfully save Data', detail_data: await Course.findOneAndUpdate({ _id: args._id, created_by: userId }, data).populate({ path: 'created_by' }).populate({ path: 'updated_by' }) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doDeleteCourse = async (args, context) => {
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    console.log('delete course invoked')
    return { status: 200, success: 'Successfully delete Data', detail_data: await Course.remove({ _id: args._id, created_by: userId }) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}

module.exports = {
  fetchAllCourses,
  fetchDetailCourse,
  doCreateCourse,
  doUpdateCourse,
  doDeleteCourse
}
