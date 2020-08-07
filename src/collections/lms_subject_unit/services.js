const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const LmsSubjectUnit = require('./Model')
const User = require('../user/Model')
const fetchAllLmsSubjectUnits = async (args, context) => {
  try {
    const filter = {}
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    filter.$and = [{ created_by: userId }, { subject_id: args.subject_id }]
    if (!_.isEmpty(args.string_to_search)) {
      filter.$and.push({
        $or: [
          { content1: { $regex: args.string_to_search, $options: 'i' } }
        ]
      })
    }
    const result = await LmsSubjectUnit.find(filter).sort({ updated_at: 'desc' }).skip(args.page_index * args.page_size).limit(args.page_size).populate({ path: 'created_by' }).populate({ path: 'updated_by' })
    const count = await LmsSubjectUnit.countDocuments(filter)
    const pageCount = await Math.ceil(count / args.page_size)
    return { status: 200, success: 'Successfully get all Data', list_data: result, count, page_count: pageCount }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const fetchDetailLmsSubjectUnit = async (args, context) => {
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const result = await LmsSubjectUnit.findOne({ _id: args.id })
      .populate({ path: 'grading_id' })
      .populate({ path: 'subject_id', populate: { path: 'course_id' } })
      .populate({ path: 'created_by' })
      .populate({ path: 'updated_by' })
    return { status: 200, success: 'Successfully get Data', data_detail: result }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const doCreateLmsSubjectUnit = async (args, context) => {
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
    return { status: 200, success: 'Successfully save Data', detail_data: await LmsSubjectUnit.create(data) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doUpdateLmsSubjectUnit = async (args, context) => {
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
    return { status: 200, success: 'Successfully save Data', detail_data: await LmsSubjectUnit.findOneAndUpdate({ _id: args._id }, data).populate({ path: 'created_by' }).populate({ path: 'updated_by' }) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doDeleteLmsSubjectUnit = async (args, context) => {
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    return { status: 200, success: 'Successfully delete Data', detail_data: await LmsSubjectUnit.remove({ _id: args._id }) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}

module.exports = {
  fetchAllLmsSubjectUnits,
  fetchDetailLmsSubjectUnit,
  doCreateLmsSubjectUnit,
  doUpdateLmsSubjectUnit,
  doDeleteLmsSubjectUnit
}
