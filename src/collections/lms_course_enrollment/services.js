const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const { lmsEnrollmentUser } = require('./Model')
const Course = require('../lms_course/Model')
const User = require('../user/Model')
const { boolean } = require('@hapi/joi')

const doSubmitCourseEnrollmentRequest = async (args, context) => {
  try {
    const now = Date.now()
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const userDetail = await User.findById(userId)
    const courseDetail = await Course.findById(args.course_id)
    console.log('args.course_id====>', args.course_id)
    // console.log('courseDetail====>', courseDetail)
    const data = {}
    data.user_id = userDetail._id
    data.created_by = userDetail._id
    data.updated_by = userDetail._id
    data.updated_at = now
    data.course_id = courseDetail._id
    data.batch = courseDetail.batch || 1
    data.status = 'requested'
    // data.created_at = now

    // create enrollment user
    // let lmsEnrollmentUserDetail = await lmsEnrollmentUser.findOne({ user_id: userId })
    // if (lmsEnrollmentUserDetail) lmsEnrollmentUserDetail = await lmsEnrollmentUserDetail.updateOne({ ...lmsEnrollmentUserDetail, ...data })
    const lmsEnrollmentUserDetail = await lmsEnrollmentUser.create(data)
    // const lmsEnrollmentUserDetail = await lmsEnrollmentUser.findOneAndUpdate({ user_id: userDetail._id }, { ...data, created_at: now, user_id: userDetail._id }, {
    //   new: true,
    //   upsert: true
    //   // rawResult: true
    // })
    console.log('lmsEnrollmentUserDetail===>', lmsEnrollmentUserDetail)
    // create enrollment course
    // const lmsEnrollmentCourseDetail = await lmsEnrollmentCourse.create({ ...data, created_at: now, course_id: courseDetail._id, status: 'requested' })
    // const lmsEnrollmentCourseDetail = await lmsEnrollmentCourse.findOneAndUpdate({ course_id: courseDetail._id }, { ...data, created_at: now, course_id: courseDetail._id }, {
    //   new: true,
    //   upsert: true
    //   // rawResult: true
    // })
    // console.log('lmsEnrollmentCourseDetail===>', lmsEnrollmentCourseDetail)

    // add course to user
    // const addCourseToUser = await lmsEnrollmentUser.findByIdAndUpdate(
    //   lmsEnrollmentUserDetail._id,
    //   { $push: { courses: courseDetail } },
    //   // { $push: { courses: { ...lmsEnrollmentCourseDetail, status: 'requested' } } },
    //   { new: true, useFindAndModify: false })

    // console.log('addCourseToUser===>', addCourseToUser)

    // add user to course
    // const addUserToCourse = await lmsEnrollmentCourse.findByIdAndUpdate(
    //   lmsEnrollmentCourseDetail._id,
    //   { $push: { users: lmsEnrollmentUserDetail } },
    //   { new: true, useFindAndModify: false })

    // console.log('addUserToCourse===>', addCourseToUser)

    // let doc = await lmsEnrollmentUser.findOneAndUpdate({user_id: userId }, {
    //   user_id: userId,
    //   status: 'requested',
    //   created_at: now,

    // }, {
    //   new: true,
    //   upsert: true // Make this update into an upsert
    // });

    // const lmsCourseEnrollmentDetail = await LmsCourseEnrollment.findOne({ user_id: userDetail._id })
    // let dataDetail

    // if (!_.isEmpty(lmsCourseEnrollmentDetail)) {
    //   lmsCourseEnrollmentDetail.updated_by = userDetail._id
    //   lmsCourseEnrollmentDetail.courses.push(courseDetail)
    //   // update
    //   // data.courses = [...lmsCourseEnrollmentDetail.courses]
    //   // lmsCourseEnrollmentDetail.update(
    //   //   { _id: lmsCourseEnrollmentDetail._id },
    //   //   { $addToSet: { courses: courseDetail, created_by:  } }
    //   // )
    //   // dataDetail = await lmsCourseEnrollmentDetail.save()
    //   // dataDetail = await LmsCourseEnrollment.updateOne({ _id: lmsCourseEnrollmentDetail._id }, lmsCourseEnrollmentDetail)
    //   dataDetail = await LmsCourseEnrollment.updateOne({ user_id: userDetail._id, 'courses._id': { $ne: courseDetail._id } }, lmsCourseEnrollmentDetail)
    // } else {
    //   // create
    //   data.created_at = now
    //   data.courses = [courseDetail]
    //   dataDetail = await LmsCourseEnrollment.create(data)
    // }

    // const data = args
    // data.batch = courseDetail.batch || 1
    // data.user_id = userDetail._id
    // data.created_by = userDetail._id
    // data.updated_by = userDetail._id
    // data.created_at = now
    // data.updated_at = now
    return { status: 200, success: 'Successfully save Data', detail_data: lmsEnrollmentUserDetail }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const fetchAllEnrollmentUserByCourseId = async (args, context) => {
  try {
    console.log('fetchAllEnrollmentUserByCourseId')
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const userDetail = await User.findById(userId)
    const courseDetail = await Course.findById(args.course_id)
    let isEligible = false
    if (_.isEqual(userDetail._id, courseDetail.created_by)) isEligible = true
    if (!isEligible) throw new Error('NOT_AUTHORIZED')
    const filter = { course_id: args.course_id }
    const result = await lmsEnrollmentUser.find(filter)
      .sort({ updated_at: 'desc' })
      .skip(args.page_index * args.page_size)
      .limit(args.page_size)
      .populate({ path: 'user_id' })
      .populate({ path: 'course_id' })
    const count = await lmsEnrollmentUser.countDocuments(filter)
    const pageCount = await Math.ceil(count / args.page_size)
    return { status: 200, success: 'Successfully get all Data', list_data: result, count, page_count: pageCount }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
// const fetchAllEnrollmentUserByFilter = async (args, context) => {
//   try {
//     console.log('fetchAllEnrollmentUserByFilter')
//     const { accesstoken } = context.req.headers
//     const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
//     const { user_id: userId } = bodyAt
//     const userDetail = await User.findById(userId)
//     const courseDetail = await Course.findById(args.course_id)
//     let isEligible = false
//     if (_.isEqual(userDetail._id, courseDetail.created_by)) isEligible = true
//     if (!isEligible) throw new Error('NOT_AUTHORIZED')
//     const filter = { course_id: args.course_id }
//     const result = await lmsEnrollmentUser.find(filter)
//       .sort({ updated_at: 'desc' })
//       .skip(args.page_index * args.page_size)
//       .limit(args.page_size)
//       .populate({ path: 'user_id' })
//       .populate({ path: 'course_id' })
//     const count = await lmsEnrollmentUser.countDocuments(filter)
//     const pageCount = await Math.ceil(count / args.page_size)
//     return { status: 200, success: 'Successfully get all Data', list_data: result, count, page_count: pageCount }
//   } catch (err) {
//     console.log('errorrr====>', err)
//     return { status: 400, error: err }
//   }
// }
// const fetchAllCourseEnrollment = async (args, context) => {
//   try {
//     console.log('fetchAllCourseEnrollment')
//     const { accesstoken } = context.req.headers
//     const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
//     const { user_id: userId } = bodyAt
//     const userDetail = await User.findById(userId)
//     const courseFilter = {}
//     if (!_.isEmpty(args.course_id)) {
//       courseFilter.$and = [{ created_by: userDetail._id }, { $or: [..._.map(args.course_id, (v, i) => ({ _id: v }))] }]
//     } else {
//       courseFilter.$and = [{ created_by: userDetail._id }]
//     }
//     const courseList = await Course.find(courseFilter)

//     console.log('courseList===>', courseList)
//     if (!_.isEmpty(courseList)) {
//       const userEnrollFilter = { 'courses.course_id': { $in: [..._.map(courseList, (v, i) => v._id)] } }
//       let result = await lmsEnrollmentUser.find(userEnrollFilter)
//       // let result = await LmsCourseEnrollment.find(userEnrollFilter)
//         .sort({ updated_at: 'desc' })
//         .skip(args.page_index * args.page_size)
//         .limit(args.page_size)
//         .populate({ path: 'user_id' })
//         .populate({ path: 'created_by' })
//         .populate({ path: 'updated_by' })
//       const count = await lmsEnrollmentUser.countDocuments(userEnrollFilter)
//       if (!_.isEmpty(args.course_id)) {
//         result = _.map(result, (v, i) => { v.courses = courseList; return v })
//       }

//       const pageCount = await Math.ceil(count / args.page_size)
//       console.log('result====>', result)
//       return { status: 200, success: 'Successfully get all Data', list_data: result, count, page_count: pageCount }
//     } else {
//       return { status: 200, success: 'Successfully get all Data', list_data: [], count: 0, page_count: 0 }
//     }
//   } catch (err) {
//     console.log('errorrr====>', err)
//     return { status: 400, error: err }
//   }
// }
const fetchAllEnrollmentUserByFilter = async (args, context) => {
  try {
    // const filter = {}
    // const now = Date.now()
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const userDetail = await User.findById(userId)

    const courseFilter = {}
    if (!_.isEmpty(args.course_id)) {
      courseFilter.$and = [{ created_by: userDetail._id }, { $or: [..._.map(args.course_id, (v, i) => ({ _id: v }))] }]
    } else {
      courseFilter.$and = [{ created_by: userDetail._id }]
    }

    // get semua kursus yang saya buat
    let courseList = await Course.find(courseFilter)
    // console.log('courseList ciptaan saya===>', _.map(courseList, (v, i) => v._id))

    // const data = args
    // data.batch = courseDetail.batch || 1
    // data.user_id = userDetail._id
    // data.created_by = userDetail._id
    // data.updated_by = userDetail._id
    // data.created_at = now
    // data.updated_at = now

    // get list user base on list course
    const LmsCourseEnrollmentFilter = {}
    LmsCourseEnrollmentFilter.$and = []
    LmsCourseEnrollmentFilter.$and.push({ $or: [..._.map(courseList, (v, i) => ({ course_id: v._id }))] })
    // console.log('LmsCourseEnrollmentFilter===>', LmsCourseEnrollmentFilter)
    // console.log('distinct===>', args.distinct)
    // let userEnrollList
    // if (args.distinct) {
    //   // const groupby = await LmsCourseEnrollment.aggregate([{ $group: { _id: '$' + args.distinct } }])
    //   // console.log('groupby===>', groupby)
    //   // LmsCourseEnrollmentFilter.$and.push({ $or: [..._.map(groupby, (v, i) => ({ user_id: '' + v._id }))] })
    //   console.log('LmsCourseEnrollmentFilter===>', LmsCourseEnrollmentFilter)
    //   userEnrollList = await LmsCourseEnrollment.find(LmsCourseEnrollmentFilter)
    // }
    // else userEnrollList = await LmsCourseEnrollment.find(LmsCourseEnrollmentFilter)

    // get semua user yang mendaftar ke kursus yang saya buat
    const userEnrollList = await lmsEnrollmentUser.find(LmsCourseEnrollmentFilter)
    console.log('userEnrollList user yg enroll courses di atasssssss===>', userEnrollList)
    const userListFilter = {}
    userListFilter.$and = []
    let userList
    if (!_.isEmpty(userEnrollList)) {
      userListFilter.$and.push({ _id: { $in: _.map(userEnrollList, (v, i) => v.user_id) } })
      if (!_.isEmpty(args.string_to_search)) {
        userListFilter.$and.push({
          $or: [
            { full_name: { $regex: args.string_to_search, $options: 'i' } },
            { email: { $regex: args.string_to_search, $options: 'i' } }
          ]
        })
      }
      console.log('userListFilter===>', userListFilter)
      userList = await User.find(userListFilter)
    }
    console.log('userList user yg sudah di filter===>', userList)
    if (!_.isEmpty(args.string_to_search)) {
      courseList = []
      courseFilter.$and.push({
        $or: [
          { title: { $regex: args.string_to_search, $options: 'i' } },
          { content1: { $regex: args.string_to_search, $options: 'i' } },
          { content2: { $regex: args.string_to_search, $options: 'i' } },
          { content3: { $regex: args.string_to_search, $options: 'i' } },
          { code: { $regex: args.string_to_search, $options: 'i' } }
        ]
      })
      courseList = await Course.find(courseFilter)
    }
    console.log('courseList course yg sudah di filter===>', _.map(courseList, (v, i) => v._id))
    const userEnrollFilter = {}
    userEnrollFilter.$or = []
    if (!_.isEmpty(courseList)) {
      userEnrollFilter.$or.push({ course_id: { $in: _.map(courseList, (v, i) => v._id) } })
    }
    if (!_.isEmpty(userList)) {
      userEnrollFilter.$or.push({ user_id: { $in: _.map(userList, (v, i) => v._id) } })
    }
    console.log('userEnrollFilterr===>', userEnrollFilter)

    const groupbyUserId = await lmsEnrollmentUser.aggregate([
      { $match: userEnrollFilter },
      {
        $group: {
          _id: '$user_id',
          created_at: { $max: '$created_at' },
          // status: '$status',
          // currentEvent: { $last: '$event.status' },
          courses: { $push: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'users'
        }
      },
      {
        $facet: {
          edges: [
            { $sort: { updated_at: -1 } }, // desc
            { $skip: args.page_index * args.page_size },
            { $limit: args.page_size }
          ],
          pageInfo: [
            { $group: { _id: null, count: { $sum: 1 } } }
          ]
        }
      }
    ])
    // const cek = await User.populate(testAggregate, { path: '_id', select: { _id: 1, fullname: 1 } })
    // console.log('testAggregate===>', groupbyUserId[0].edges[0])
    // console.log('testAggregate pageInfo===>', groupbyUserId[0].pageInfo[0])
    // console.log('cek===>', cek)
    console.dir(groupbyUserId)
    const result = [..._.map(groupbyUserId[0].edges, (v, i) => ({ _id: v._id, created_at: v.created_at, user_id: v.users[0] }))]
    // console.log('result====>', result)
    const count = groupbyUserId[0].pageInfo[0].count
    // let result, count
    // if (!_.isEmpty(userEnrollFilter.$or)) {
    //   if (_.isEmpty(args.distinct)) {
    //     result = await lmsEnrollmentUser.find(userEnrollFilter)
    //       .sort({ updated_at: 'desc' })
    //       .skip(args.page_index * args.page_size)
    //       .limit(args.page_size)
    //       .populate({ path: 'user_id' })
    //       .populate({ path: 'course_id' })
    //     count = await lmsEnrollmentUser.countDocuments(userEnrollFilter)
    //   } else {
    //     result = await lmsEnrollmentUser.find(userEnrollFilter)
    //       .sort({ updated_at: 'desc' })
    //       .skip(args.page_index * args.page_size)
    //       .limit(args.page_size)
    //       .populate({ path: 'user_id' })
    //       .populate({ path: 'course_id' })
    //     count = await lmsEnrollmentUser.countDocuments(userEnrollFilter)
    //   }
    const pageCount = await Math.ceil(count / args.page_size)
    //   console.log('result====>', result)
    return { status: 200, success: 'Successfully get all Data', list_data: result, count, page_count: pageCount }
    // } else {
    //   return { status: 200, success: 'Successfully get all Data', list_data: [], count: 0, page_count: 0 }
    // }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}

module.exports = {
  doSubmitCourseEnrollmentRequest,
  fetchAllEnrollmentUserByCourseId,
  fetchAllEnrollmentUserByFilter
}
