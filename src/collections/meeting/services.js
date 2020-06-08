const Meeting = require('./Model')
const User = require('../user/Model')

const createMeetingService = async (title, host, createdBy, startDate, endDate) => {
  try {
    if (!title) throw new Error('Invalid title')
    if (!host) throw new Error('Invalid host')
    if (!createdBy) throw new Error('Invalid createdBy')
    if (!startDate) throw new Error('Invalid startDate')
    if (!endDate) throw new Error('Invalid endDate')

    const { error } = await Meeting.validate({ title, host, createdBy, startDate, endDate })
    if (error) {
      if (error.details[0].message.includes('fails to match the valid mongo id pattern')) {
        throw new Error('Invalid id')
      }
      throw new Error(error.details[0].message)
    }

    const currentHost = {
      userId: host
    }

    const meeting = await Meeting({
      title,
      host: currentHost,
      createdBy,
      startDate,
      endDate,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    })

    await meeting.save()

    return { status: 200, success: 'Successfully create meeting' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed create meeting' }
  }
}

const addParticipantService = async (meetingId, userId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')
    if (!userId) throw new Error('Invalid user id')

    const { error } = await Meeting.validate({ meetingId, participants: userId })
    if (error) throw new Error(error.details[0].message)

    // check if user id valid
    const user = await User.findOne({ _id: userId })
    if (!user) throw new Error('Invalid user id')

    // check if meeting id valid
    const meeting = await Meeting.findOne({ _id: meetingId })
    if (!meeting) throw new Error('Invalid meeting id')

    // check if user already participant
    meeting.participants.forEach(e => {
      if (e.userId === userId) {
        throw new Error('User already a participant')
      }
    })

    const newParticipant = {
      userId
    }

    await Meeting.findOneAndUpdate({ _id: meetingId }, { $push: { participants: newParticipant } })

    return { status: 200, success: 'Successfully add participants' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed add Participant' }
  }
}

const addHostService = async (meetingId, userId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')
    if (!userId) throw new Error('Invalid user id')

    const { error } = await Meeting.validate({ meetingId, hosts: userId })
    if (error) throw new Error(error.details[0].message)

    const user = await User.findOne({ _id: userId })
    if (!user) throw new Error('Invalid user id')

    const meeting = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE' })
    if (!meeting) throw new Error('Invalid meeting id')

    meeting.hosts.forEach(e => {
      if (e.userId === userId) {
        throw new Error('User already a host')
      }
    })

    const newHost = {
      userId
    }

    await Meeting.findOneAndUpdate({ _id: meetingId }, { $push: { hosts: newHost } })

    return { status: 200, success: 'Successfully add host' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed add host' }
  }
}

const finishMeetingService = async (meetingId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')

    const { error } = await Meeting.validate({ meetingId })
    if (error) throw new Error(error.details[0].message)

    const meeting = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE' })
    if (!meeting) throw new Error('Invalid meeting id')

    await Meeting.findOneAndUpdate({ _id: meetingId }, { status: 'INACTIVE', updatedAt: new Date().getTime() })

    return { status: 200, success: 'Successfully finish meeting' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed finish meeting' }
  }
}

module.exports = {
  createMeetingService,
  finishMeetingService,
  addParticipantService,
  addHostService
}
