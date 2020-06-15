const Meeting = require('../Model')
const User = require('../../user/Model')

const createMeetingService = async (title, host, createdBy, startDate, endDate, permission) => {
  try {
    if (!title) throw new Error('Invalid title')
    if (!host) throw new Error('Invalid host')
    if (!createdBy) throw new Error('Invalid createdBy')
    if (!startDate) throw new Error('Invalid startDate')

    const hostChecker = await User.findOne({ _id: host })
    if (!hostChecker) throw new Error('Invalid host')

    const { error } = await Meeting.validate({ title, host, createdBy, startDate, endDate, permission })
    if (error) {
      throw new Error(error.details[0].message)
    }

    const meeting = await Meeting({
      title,
      hosts: { userId: host },
      createdBy,
      startDate,
      endDate,
      needPermisionToJoin: permission,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    })

    if (meeting.endDate === '') meeting.endDate = null

    await meeting.save()

    console.log('meeting=', meeting)

    return { status: 200, success: 'Successfully create meeting', meeting }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed create meeting' }
  }
}

const allowParticipantToJoinService = async (meetingId, userId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')
    if (!userId) throw new Error('Invalid user id')

    const { error } = await Meeting.validate({ meetingId, participant: userId })
    if (error) throw new Error(error.details[0].message)

    // check if user id valid
    const user = await User.findOne({ _id: userId })
    if (!user) throw new Error('Invalid user id')

    // check if meeting id valid
    const meeting = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE' })
    if (!meeting) throw new Error('Invalid meeting id')

    // add requestedParticipant to participants
    await Meeting.findOneAndUpdate({ _id: meetingId }, { $push: { participants: { userId } } })

    await Meeting.findOneAndUpdate({ _id: meetingId }, { $pull: { requestToJoin: { userId } } })

    return { status: 200, success: 'Successfully add participants' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed add Participant' }
  }
}

const addHostService = async (meetingId, userId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')
    if (!userId) throw new Error('Invalid user id')

    const { error } = await Meeting.validate({ meetingId, host: userId })
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

const hostRemoveParticipantService = async (meetingId, hostId, participantId) => {
  try {

    if (!meetingId) throw new Error('Invalid meeting id')
    if (!hostId) throw new Error('Invalid host id')
    if (!participantId) throw new Error('Invalid participant id')

    const { error } = await Meeting.validate({ meetingId, host: hostId, participant: participantId })
    if (error) throw new Error(error.details[0].message)

    const meeting = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE' })
    if (!meeting) throw new Error('Invalid meeting id')

    const host = await User.findOne({ _id: hostId })
    if (!host) throw new Error('Invalid host id')

    const participant = await User.findOne({ _id: participantId })
    if (!participant) throw new Error('Invalid participant id')

    // check if participant is currently in meeting
    const isParticipantInMeeting = await meeting.participants.findIndex(e => e.userId === participantId)
    if (isParticipantInMeeting === -1) throw new Error('Invalid participant id')

    // remove participant from participants and add the removed participant to removedParticipants
    await meeting.participants.pop({ userId: participantId })
    await meeting.removedParticipants.push({ userId: participantId })
    await meeting.save()

    return { status: 200, success: 'Successfully remove participant' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed remove participant' }
  }
}

const requestToJoinMeetingService = async (meetingId, userId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')
    if (!userId) throw new Error('Invalid user id')

    const { error } = await Meeting.validate({ meetingId, participant: userId })
    if (error) throw new Error(error.details[0].message)

    // Meeting don't need permission (automatically join)
    const noPermissionNeeded = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE', needPermisionToJoin: 'No' })
    if (noPermissionNeeded) {
      await Meeting.findOneAndUpdate({ _id: meetingId }, { $push: { participants: { userId } } })
      return { status: 200, success: 'Successfully join meeting' }
    }

    const meeting = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE', needPermisionToJoin: 'Yes' })
    if (!meeting) throw new Error('Invalid meeting id')

    const user = await User.findOne({ _id: userId })
    if (!userId) throw new Error('Invalid user id')

    await meeting.requestToJoin.push({ userId: user._id, name: user.fullName })
    await meeting.save()

    return { status: 200, success: 'Successfully request to join meeting' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed request to join' }
  }
}

const showParticipantsThatRequestService = async (meetingId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')

    const { error } = await Meeting.validate({ meetingId })
    if (error) throw new Error(error.details[0].message)

    const meeting = await Meeting.findOne({ _id: meetingId })
    return { status: 200, success: 'Successfully get participants', participants: meeting.requestToJoin }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed get participants who request' }
  }
}

module.exports = {
  createMeetingService,
  finishMeetingService,
  addHostService,
  hostRemoveParticipantService,
  requestToJoinMeetingService,
  showParticipantsThatRequestService,
  allowParticipantToJoinService
}
