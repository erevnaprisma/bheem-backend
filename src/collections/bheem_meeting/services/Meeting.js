const Meeting = require('../Model')
const User = require('../../bheem_user/Model')

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

    return { status: 200, success: 'Successfully create meeting', meeting }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed create meeting' }
  }
}

const admitParticipantToJoinService = async (meetingId, userId, hostId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')
    if (!userId) throw new Error('Invalid user id')
    if (!hostId) throw new Error('Invalid host id')

    const { error } = await Meeting.admitOrReject({ meetingId, userId, hostId })
    if (error) throw new Error(error.details[0].message)

    // check if user id valid
    const user = await User.findOne({ _id: userId })
    if (!user) throw new Error('Invalid user id')

    // check if host id valid
    const host = await User.findOne({ _id: hostId })
    if (!host) throw new Error('Invalid host id')

    // check if meeting id valid
    const meeting = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE', needPermisionToJoin: 'Yes' })
    if (!meeting) throw new Error('Invalid meeting id')

    // check if host id is a real meeting host
    const isValidHost = await meeting.hosts.find(e => e.userId === hostId)
    if (!isValidHost) throw new Error('host id is not this meeting host')

    // add requestedParticipant to participants
    await Meeting.findOneAndUpdate({ _id: meetingId }, { $push: { participants: { userId } } })

    await Meeting.findOneAndUpdate({ _id: meetingId }, { $pull: { requestToJoin: { userId } } })

    return { status: 200, success: 'Successfully add participants' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed add Participant' }
  }
}

const addHostService = async (meetingId, userId, hostId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')
    if (!userId) throw new Error('Invalid user id')

    const { error } = await Meeting.validate({ meetingId, host: userId })
    if (error) throw new Error(error.details[0].message)

    // check if user id valid
    const user = await User.findOne({ _id: userId })
    if (!user) throw new Error('Invalid user id')

    // check if host id valid
    const host = await User.findOne({ _id: hostId })
    if (!host) throw new Error('Invalid host id')

    // check if meeting exist
    const meeting = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE' })
    if (!meeting) throw new Error('Invalid meeting id')

    const isValidHost = await meeting.hosts.find(e => e.userId === hostId)
    if (!isValidHost) throw new Error('Host id is not this meeting host')

    // check if user is already a host
    const userAlreadyHost = await meeting.hosts.find(e => e.userId === userId)
    if (userAlreadyHost) throw new Error('user already host in this meeting')

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

    // check if host id valid
    const host = await User.findOne({ _id: hostId })
    if (!host) throw new Error('Invalid host id')

    // check if participant id valid
    const participant = await User.findOne({ _id: participantId })
    if (!participant) throw new Error('Invalid participant id')

    // check if meeting id exist
    const meeting = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE' })
    if (!meeting) throw new Error('Invalid meeting id')

    // check if host id is a real meeting host
    const isHostValid = await meeting.hosts.find(e => e.userId === hostId)
    if (!isHostValid) throw new Error('Host id is not this meeting host')

    // check if participant was already removed
    const isParticipantAlreadyRemoved = await meeting.removedParticipants.find(e => e.userId === participantId)
    if (isParticipantAlreadyRemoved) throw new Error('Participant already removed')

    // check if participant is currently in meeting
    const isParticipantValid = await meeting.participants.find(e => e.userId === participantId)
    if (!isParticipantValid) throw new Error('Participant id is not in meeting')

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

    // check if user exist
    const user = await User.findOne({ _id: userId })
    if (!user) throw new Error('Invalid user id')

    // check if meeting exist
    const meeting = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE' })
    if (!meeting) throw new Error('Invalid meeting id')

    // check if user is host
    const isUserHost = await meeting.hosts.find(e => e.userId === userId)
    if (isUserHost) throw new Error('User is host')

    // check if user already a participant
    const alreadyParticipant = await meeting.participants.find(e => e.userId === userId)
    if (alreadyParticipant) throw new Error('User already a participant')

    // check if user already request to join
    const alreadyRequestToJoin = await meeting.requestToJoin.find(e => e.userId === userId)
    if (alreadyRequestToJoin) throw new Error('User already request to join')

    // check meeting lock status
    if (meeting.lockMeeting === 'TRUE') throw new Error('Host already lock the meeting')

    // check meeting limit
    const totalMeetingList = meeting.participants.length + meeting.hosts.length
    if (meeting.limit === totalMeetingList) throw new Error('Meeting has reached participant limit')

    // Meeting don't need permission (automatically join)
    const noPermissionNeeded = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE', needPermisionToJoin: 'No' })
    if (noPermissionNeeded) {
      await Meeting.findOneAndUpdate({ _id: meetingId }, { $push: { participants: { userId } } })
      return { status: 200, success: 'Successfully join meeting' }
    }

    await meeting.requestToJoin.push({ userId: user._id })
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

const isMeetingExistService = async (meetingId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')

    const meeting = await Meeting.findOne({ _id: meetingId })
    if (!meeting) throw new Error('Meeting not found')

    return { status: 200, success: 'Successfully find meeting', meeting }
  } catch (err) {
    if (err.message.includes('Cast to ObjectId failed')) {
      err.message = 'Meeting not found'
    }
    return { status: 400, error: err.message || 'Meeting not found' }
  }
}

const testingPurposeOnlyService = async (id) => {
  try {
    if (!id) throw new Error('Invalid id')
    return { status: 200, success: id }
  } catch (err) {
    return { status: 400, error: err.message }
  }
}

const rejectParticipantToJoinService = async (meetingId, userId, hostId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')
    if (!userId) throw new Error('Invalid user id')
    if (!hostId) throw new Error('Invalid host id')

    const { error } = await Meeting.admitOrReject({ meetingId, userId, hostId })
    if (error) throw new Error(error.details[0].message)

    // check if user id valid
    const user = await User.findOne({ _id: userId })
    if (!user) throw new Error('Invalid user id')

    // check if host id valid
    const host = await User.findOne({ _id: hostId })
    if (!host) throw new Error('Invalid host id')

    // check if meeting id valid
    const meeting = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE', needPermisionToJoin: 'Yes' })
    if (!meeting) throw new Error('Invalid meeting id')

    // check if host id is a real meeting host
    const isValidHost = await meeting.hosts.find(e => e.userId === hostId)
    if (!isValidHost) throw new Error('host id is not this meeting host')

    // pull user from request to join
    await Meeting.findOneAndUpdate({ _id: meetingId }, { $pull: { requestToJoin: { userId } } })

    return { status: 200, success: 'Successfully reject participants' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed reject Participant' }
  }
}

const isUserHostService = async (userId, meetingId) => {
  try {
    if (!userId) throw new Error('Invalid user id')
    if (!meetingId) throw new Error('Invalid meeting id')

    const user = await User.findOne({ _id: userId })
    if (!user) throw new Error('Invalid user id')

    const meeting = await Meeting.findOne({ _id: meetingId })
    if (!meeting) throw new Error('Invalid meeting id')

    let isUserHost = false

    await meeting.hosts.forEach(e => {
      if (e.userId === userId) {
        isUserHost = true
      }
    })

    return { status: 200, success: 'Successfully get user information', isUserHost }
  } catch (err) {
    return { status: 400, error: err.message || 'Faild to get information about user' }
  }
}

const removeUserFromParticipantsService = async (userId, meetingId) => {
  try {
    const meeting = await Meeting.findOne({ _id: meetingId })
    if (!meeting) throw new Error('Invalid meeting id')

    const newParticipants = await meeting.participants.filter(e => e.userId !== userId)

    const newRequestToJoin = await meeting.requestToJoin.filter(e => e.userId !== userId)

    meeting.participants = newParticipants
    meeting.requestToJoin = newRequestToJoin
    await meeting.save()
    return { status: 200, success: 'Successfully remove user' }
  } catch (err) {
    return { status: 400, error: 'Failed to remove user from participants' }
  }
}

const endMeetingService = async (meetingId) => {
  try {
    // check if meeting exist
    const meeting = await Meeting.findOne({ _id: meetingId })
    if (!meeting) throw new Error('Invalid meeting id')

    meeting.status = 'INACTIVE'
    await meeting.save()

    return { status: 200, success: 'Successfully end meeting' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed end meeting' }
  }
}

const lockMeetingService = async (meetingId) => {
  try {
    const meeting = await Meeting.findOne({ id: meetingId })
    if (!meeting) throw new Error('Invalid meeting id')

    meeting.lockMeeting = 'TRUE'
    await meeting.save()

    return { status: 200, success: 'Successfully lock meeting' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed lock meeting' }
  }
}

const getCurrentMeetingListService = async (meetingId) => {
  try {
    const meetingList = []

    // get hosts list
    const { hosts } = await Meeting.findOne({ _id: meetingId }).populate('hosts.userId').select('hosts -_id')

    let newHost

    await hosts.forEach(e => {
      newHost = {
        fullName: e.userId.fullName,
        role: 'Host',
        userId: e.userId._id
      }

      meetingList.push(newHost)
    })

    // get participants list
    const { participants } = await Meeting.findOne({ _id: meetingId }).populate('participants.userId').select('participants -_id')

    let newParticipant

    await participants.forEach(e => {
      newParticipant = {
        fullName: e.userId.fullName,
        role: 'Participant',
        userId: e.userId._id
      }

      meetingList.push(newParticipant)
    })

    return { status: 200, success: 'Successfully get current meeting list', meetingList }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed get current meeting list' }
  }
}

module.exports = {
  createMeetingService,
  finishMeetingService,
  addHostService,
  hostRemoveParticipantService,
  requestToJoinMeetingService,
  showParticipantsThatRequestService,
  admitParticipantToJoinService,
  isMeetingExistService,
  testingPurposeOnlyService,
  rejectParticipantToJoinService,
  isUserHostService,
  removeUserFromParticipantsService,
  endMeetingService,
  lockMeetingService,
  getCurrentMeetingListService
}
