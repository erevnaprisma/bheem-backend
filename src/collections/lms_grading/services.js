const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const LmsGrading = require('./Model')
const User = require('../user/Model')
const fetchAllLmsGradings = async (args, context) => {
  try {
    const filter = {}
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    filter.$and = [{ course_id: args.course_id }]
    if (!_.isEmpty(args.string_to_search)) {
      filter.$and.push({
        $or: [
          { content1: { $regex: args.string_to_search, $options: 'i' } },
          { title: { $regex: args.string_to_search, $options: 'i' } },
          { points: { $regex: args.string_to_search, $options: 'i' } }
        ]
      })
    }
    const result = await LmsGrading.find(filter).sort({ updated_at: 'desc' }).skip(args.page_index * args.page_size).limit(args.page_size).populate({ path: 'created_by' }).populate({ path: 'updated_by' })
    const count = await LmsGrading.countDocuments(filter)
    const pageCount = await Math.ceil(count / args.page_size)
    return { status: 200, success: 'Successfully get all Data', list_data: result, count, page_count: pageCount }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const fetchAllLmsGradingsByCourseId = async (args, context) => {
  try {
    const filter = {}
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    filter.$and = [{ course_id: args.course_id }]
    if (!_.isEmpty(args.string_to_search)) {
      filter.$and.push({
        $or: [
          { content1: { $regex: args.string_to_search, $options: 'i' } },
          { title: { $regex: args.string_to_search, $options: 'i' } },
          { points: { $regex: args.string_to_search, $options: 'i' } }
        ]
      })
    }
    const result = await LmsGrading.find(filter).sort({ updated_at: 'desc' }).skip(args.page_index * args.page_size).limit(args.page_size).populate({ path: 'created_by' }).populate({ path: 'updated_by' })
    const count = await LmsGrading.countDocuments(filter)
    const pageCount = await Math.ceil(count / args.page_size)
    return { status: 200, success: 'Successfully get all Data', list_data: result, count, page_count: pageCount }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const fetchDetailLmsGrading = async (args, context) => {
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const result = await LmsGrading.findOne({ _id: args.id })
      .populate({ path: 'course_id' })
      .populate({ path: 'created_by' })
      .populate({ path: 'updated_by' })
    return { status: 200, success: 'Successfully get Data', data_detail: result }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const doCreateLmsGrading = async (args, context) => {
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
    return { status: 200, success: 'Successfully save Data', detail_data: await LmsGrading.create(data) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doUpdateLmsGrading = async (args, context) => {
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
    return { status: 200, success: 'Successfully save Data', detail_data: await LmsGrading.findOneAndUpdate({ _id: args._id }, data).populate({ path: 'created_by' }).populate({ path: 'updated_by' }) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doDeleteLmsGrading = async (args, context) => {
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    return { status: 200, success: 'Successfully delete Data', detail_data: await LmsGrading.remove({ _id: args._id }) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}

module.exports = {
  fetchAllLmsGradingsByCourseId,
  fetchAllLmsGradings,
  fetchDetailLmsGrading,
  doCreateLmsGrading,
  doUpdateLmsGrading,
  doDeleteLmsGrading
}
