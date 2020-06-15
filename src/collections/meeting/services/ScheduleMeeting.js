const User = require('../../user/Model')
const Meeting = require('../Model')

const createScheduleMeetingService = async (title, host, createdBy, startDate, endDate, permission) => {
  try {
    if (!title) throw new Error('Invalid title')
    if (!host) throw new Error('Invalid host')
    if (!createdBy) throw new Error('Invalid created by')
    if (!startDate) throw new Error('Invalid start date')
    if (!endDate) throw new Error('Invalid end date')

    const hostChecker = await User.findOne({ _id: host })
    if (!hostChecker) throw new Error('Invalid host')

    const { error } = await Meeting.validate({ title, host: host, createdBy, startDate, endDate, permission })
    if (error) throw new Error(error.details[0].message)

    const meeting = await Meeting({
      title,
      hosts: { userId: host },
      status: 'SCHEDULE',
      permission,
      createdBy,
      startDate,
      endDate,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    })

    await meeting.save()

    return { status: 200, success: 'Successfully schedule a meeting', title: meeting.title, host: host, createdBy: meeting.createdBy, startDate: meeting.startDate, endDate: meeting.endDate, createdAt: meeting.createdAt, meetingId: meeting._id }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed create meeting' }
  }
}

const cancelScheduleMeetingService = async (meetingId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')

    const { error } = await Meeting.validate({ meetingId })
    if (error) throw new Error(error.details[0].message)

    await Meeting.findOneAndUpdate({ _id: meetingId }, { status: 'INACTIVE' })

    return { status: 200, success: 'Successfully cancel a schedule meeting' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed cancel schedule meeting' }
  }
}

const showScheduleMeetings = async (userId) => {
  try {
    if (!userId) throw new Error('Invalid user id')

    const user = await User.findOne({ _id: userId })
    if (!user) throw new Error('Invalid user id')

    const meetings = await Meeting.find({ createdBy: userId, status: 'SCHEDULE' })

    return { status: 200, success: 'Successfully show schedule meetings', meetings }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed show schedule meetings' }
  }
}

const startScheduleMeeting = async (meetingId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')

    const meeting = await Meeting.findOneAndUpdate({ _id: meetingId, status: 'SCHEDULE' }, { status: 'ACTIVE' })
    if (!meeting) throw new Error('Invalid meeting id')

    return { status: 200, success: 'Successfully start schedule meeting' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed start a schedule meeting' }
  }
}

const editScheduleMeeting = async (meetingId, title, permission, startDate, endDate) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')

    const { error } = await Meeting.validateEditedScheduleMeeting({ title, permission, startDate, endDate })
    if (error) throw new Error(error.details[0].message)

    const meeting = await Meeting.findOne({ _id: meetingId, status: 'SCHEDULE' })
    if (!meeting) throw new Error('Invalid meeting id')

    if (!title) meeting.title = title
    if (!permission) meeting.permission = permission
    if (!startDate) meeting.startDate = startDate
    if (!endDate) meeting.endDate = endDate

    await meeting.save()

    return { status: 200, success: 'Successfully edit meeting' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed edit meeting' }
  }
}

module.exports = {
  createScheduleMeetingService,
  cancelScheduleMeetingService,
  showScheduleMeetings,
  startScheduleMeeting,
  editScheduleMeeting
}
