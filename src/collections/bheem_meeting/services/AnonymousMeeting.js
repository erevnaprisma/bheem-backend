// Model
const Meeting = require('../Model')
const User = require('../../bheem_user/Model')

// Variables
var ObjectId = require('mongodb').ObjectID

const anonymousRequestToJoinMeetingService = async (meetingId, username, userId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')
    if (!username) throw new Error('Invalid username')
    if (!userId) throw new Error('Invalid user id')

    const { error } = await Meeting.validate({ meetingId: meetingId, participant: userId })
    if (error) throw new Error(error.details[0].message)

    // if no permission
    const noPermissionNeeded = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE', needPermisionToJoin: 'No' })
    if (noPermissionNeeded) {
      await Meeting.findOneAndUpdate({ _id: meetingId }, { $push: { participants: { userId, status: 'Anonymous', nameForAnonymous: username } } })
      return { status: 200, success: 'Successfully join meeting' }
    }

    // if meeting has permission
    const meeting = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE', needPermisionToJoin: 'Yes' })
    if (!meeting) throw new Error('Invalid meeting id')

    await meeting.requestToJoin.push({ userId, nameForAnonymous: username, status: 'Anonymous' })
    await meeting.save()

    return { status: 200, success: 'Successfully request to join' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed request to join' }
  }
}

const anonymousAdmitParticipantToJoinService = async (meetingId, hostId, userId, username) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')
    if (!hostId) throw new Error('Invalid host id')
    if (!userId) throw new Error('Invalid user id')
    if (!username) throw new Error('Invalid username')

    const { error } = await Meeting.admitOrReject({ meetingId, userId, hostId })
    if (error) throw new Error(error.details[0].message)

    // check if meeting exist
    const meeting = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE', needPermisionToJoin: 'Yes' })
    if (!meeting) throw new Error('Invalid meeting id')

    // check if host exist
    const host = await User.findOne({ _id: hostId })
    if (!host) throw new Error('Invalid host id')

    // check if host is a valid host in this meeting
    const isHostValid = meeting.hosts.find(e => e.userId === hostId)
    if (!isHostValid) throw new Error('Host id is not this meeting host')

    // add requestedParticipant to participants
    await Meeting.findOneAndUpdate({ _id: meetingId }, { $push: { participants: { userId, status: 'Anonymous', nameForAnonymous: username } } })

    await Meeting.findOneAndUpdate({ _id: meetingId }, { $pull: { requestToJoin: { userId } } })

    return { status: 200, success: 'Successfully admit anonymous participant' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed admit anonymous participant' }
  }
}

const anonymousRejectParticipantToJoinService = async (meetingId, userId, hostId) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')
    if (!userId) throw new Error('Invalid user id')
    if (!hostId) throw new Error('Invalid host id')

    const { error } = await Meeting.admitOrReject({ meetingId, userId, hostId })
    if (error) throw new Error(error.details[0].message)

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

module.exports = {
  anonymousRequestToJoinMeetingService,
  anonymousAdmitParticipantToJoinService,
  anonymousRejectParticipantToJoinService
}
