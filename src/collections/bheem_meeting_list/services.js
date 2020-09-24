const { required } = require('@hapi/joi')
// models
const MeetingList = require('../bheem_meeting_list/Model')
const User = require('../bheem_user/Model')
const Meeting = require('../bheem_meeting/Model')

const createMeetingListService = async (meetingId, userId, audio, video, socketId) => {
  try {
    const { error } = await MeetingList.createMeetingList({ meetingId, userId, audio, video, socketId })
    if (error) throw new Error(error.details[0].message)

    // check valid user id
    const user = await User.findOne({ _id: userId })
    if (!user) throw new Error('Invalid user id')

    // check valid meeting id
    const meeting = await Meeting.findOne({ _id: meetingId })
    if (!meeting) throw new Error('Invalid meeting id')

    const meetingList = await new MeetingList({
      meetingId,
      userId,
      audio,
      video,
      socketId
    })

    await meetingList.save()

    return { status: 200, message: 'Successfully create new meeting list', meetingList }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed create new meeting list' }
  }
}

const joinMeetingList = async (meetingId, userId, audio, video, socketId) => {
  try {
    const { error } = await MeetingList.joinMeetingList({ meetingId, userId, audio, video, socketId })
    if (error) throw new Error(error.details[0].message)

    // check valid meeting id
    const meeting = await Meeting.findOne({ _id: meetingId })
    if (!meeting) throw new Error('Invalid meeting id')

    const newUser = {
      userId,
      audio,
      video,
      socketId
    }

    const meetingList = await MeetingList.findOneAndUpdate({ meetingId }, { $push: { meetingList: newUser } })

    await meetingList.save()

    return { status: 200, message: 'Successfully join meeting' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed join meeting list' }
  }
}

const userAudioVideoUpdate = async (meetingId, userId, type, value) => {
  try {
    const { error } = await MeetingList.updateFlag({ meetingId, userId, type, value })
    if (error) throw new Error(error.details[0].message)

    // check valid meeting id
    const meeting = await Meeting.findOne({ _id: meetingId })
    if (!meeting) throw new Error('Invalid meeting id')

    // check valid user id
    const user = await User.findOne({ _id: userId })
    if (!user) throw new Error('Invalid user id')

    // check valid meeting list
    const meetingList = await MeetingList.findOne({ meetingId })
    if (!meetingList) throw new Error('Invalid meeting id')

    // check if user is in meeting list
    var userExistInMeetingList = false

    for await (const val of meetingList) {
      if (val.userId === userId) {
        userExistInMeetingList = true

        if (type === 'audio') {
          val.audio = value
        } else if (type === 'video') {
          val.video = value
        }

        await meetingList.save()
      }
    }

    if (!userExistInMeetingList) throw new Error('Invalid user id')

    return { status: 200, success: 'Successfully change user audio or video' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed change user audio or video' }
  }
}

const userAudioVideoUpdateAll = async (meetingId, type, value) => {
  try {
    const { error } = await MeetingList.updateFlagForAll({ meetingId, type, value })
    if (error) throw new Error(error.details[0].message)

    // check valid meeting id
    const meeting = await MeetingList.findOne({ _id: meetingId })
    if (!meeting) throw new Error('Invalid meeting id')

    const meetingList = await MeetingList.findOne({ meetingId })
    if (!meetingList) throw new Error('Invalid meeting id')

    if (type === 'audio') {
      await MeetingList.updateMany({ meetingId }, { $set: { 'meetingList.audio': value } })
    } else if (type === 'video') {
      await MeetingList.updateMany({ meetingId }, { $set: { 'meetingList.video': value } })
    }

    return { status: 200, message: 'Successfully change all user audio or video' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed change all audio or video' }
  }
}

const removeFromMeetingList = async (meetingId, userId) => {
  try {
    const { error } = await MeetingList.remove({ meetingId, userId })
    if (error) throw new Error(error.details[0].message)

    // check if meeting valid
    const meeting = await Meeting.findOne({ _id: meetingId })
    if (!meeting) throw new Error('Invalid meeting id')

    // check if user valid
    const user = await User.findOne({ _id: userId })
    if (!user) throw new Error('Invalid user id')

    const meetinglist = await MeetingList.findOne({ meetingId })
    if (!meetinglist) throw new Error('Invalid meeting id')

    Meeting.updateOne({ meetingId }, { $pull: { meetingList: { userId } } })

    return { status: 200, message: 'Successfully remove from meeting list' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed remove from meeting list' }
  }
}

const getSpesificUserMeetingList = async (meetingId, userId) => {
  try {
    // check if meeting valid
    const meeting = await Meeting.findOne({ _id: meetingId })
    if (!meeting) throw new Error('Invalid meeting id')

    const meetList = await MeetingList.findOne({ meetingId })
    if (!meetList) throw new Error('Invalid meeting id')

    var userInfo

    for (const info of meetList.meetingList) {
      if (info.userId === userId) {
        userInfo = await info
      }
    }

    return { status: 200, message: 'Successfully get spesific user info', userInfo }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed get spesific user info' }
  }
}

module.exports = {
  createMeetingListService,
  userAudioVideoUpdate,
  userAudioVideoUpdateAll,
  joinMeetingList,
  removeFromMeetingList,
  getSpesificUserMeetingList
}
