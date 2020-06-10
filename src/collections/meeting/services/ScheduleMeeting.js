const User = require('../../user/Model')
const Meeting = require('../Model')

const createScheduleMeetingService = async (title, host, createdBy, startDate, endDate) => {
  try {
    if (!title) throw new Error('Invalid title')
    if (!host) throw new Error('Invalid host')
    if (!createdBy) throw new Error('Invalid created by')
    if (!startDate) throw new Error('Invalid start date')
    if (!endDate) throw new Error('Invalid end date')

    const hostChecker = await User.findOne({ _id: host })
    if (!hostChecker) throw new Error('Invalid host')

    const { error } = await Meeting.validate({ title, host: host, createdBy, startDate, endDate })
    if (error) throw new Error(error.details[0].message)

    const meeting = await Meeting({
      title,
      hosts: { userId: host },
      createdBy,
      startDate,
      endDate,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    })

    await meeting.save()

    return { status: 200, success: 'Successfully schedule a meeting', title: meeting.title, host: meeting.host, createdBy: meeting.createdBy, startDate: meeting.startDate, endDate: meeting.endDate, createdAt: meeting.createdAt, meetingId: meeting._id }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed create meeting' }
  }
}

module.exports = {
  createScheduleMeetingService
}
