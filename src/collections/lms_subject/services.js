const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const Subject = require('./Model')
const User = require('../user/Model')
const fetchAllSubjects = async (args, context) => {
  try {
    const filter = {}
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    filter.$and = [{ created_by: userId }, { course_id: args.course_id }]
    if (!_.isEmpty(args.string_to_search)) {
      filter.$and.push({
        $or: [
          { title: { $regex: args.string_to_search, $options: 'i' } },
          { content1: { $regex: args.string_to_search, $options: 'i' } }
        ]
      })
    }
    const result = await Subject.find(filter).sort({ updated_at: 'desc' }).skip(args.page_index * args.page_size).limit(args.page_size).populate({ path: 'created_by' }).populate({ path: 'updated_by' })
    const count = await Subject.countDocuments(filter)
    const pageCount = await Math.ceil(count / args.page_size)
    return { status: 200, success: 'Successfully get all Data', list_data: result, count, page_count: pageCount }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const fetchDetailSubject = async (args, context) => {
  console.log('fetchDetailSubject===>', args)
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const result = await Subject.findOne({ _id: args.id, created_by: userId }).populate({ path: 'course_id' }).populate({ path: 'created_by' }).populate({ path: 'updated_by' })
    return { status: 200, success: 'Successfully get Data', data_detail: result }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const doCreateSubject = async (args, context) => {
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
    return { status: 200, success: 'Successfully save Data', detail_data: await Subject.create(data) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doUpdateSubject = async (args, context) => {
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
    return { status: 200, success: 'Successfully save Data', detail_data: await Subject.findOneAndUpdate({ _id: args._id, created_by: userId }, data).populate({ path: 'created_by' }).populate({ path: 'updated_by' }) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doDeleteSubject = async (args, context) => {
  try {
    return { status: 200, success: 'Successfully delete Data', detail_data: await Subject.remove({ _id: args._id }) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}

module.exports = {
  fetchAllSubjects,
  fetchDetailSubject,
  doCreateSubject,
  doUpdateSubject,
  doDeleteSubject
}
