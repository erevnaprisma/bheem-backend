const Meeting = require('../Model')
var ObjectId = require('mongodb').ObjectID

const anonymousRequestToJoinMeetingService = async (meetingId, name) => {
  try {
    if (!meetingId) throw new Error('Invalid meeting id')
    if (!name) throw new Error('Invalid name')

    const userId = new ObjectId().toString()

    const { error } = await Meeting.validate({ meetingId: meetingId, participant: userId })
    if (error) throw new Error(error.details[0].message)

    const noPermissionNeeded = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE', needPermisionToJoin: 'No' })
    if (noPermissionNeeded) {
      await Meeting.findOneAndUpdate({ _id: meetingId }, { $push: { participants: { userId, status: 'Anonymous', name } } })
      return { status: 200, success: 'Successfully request to join meeting' }
    }

    const meeting = await Meeting.findOne({ _id: meetingId, status: 'ACTIVE', needPermisionToJoin: 'Yes' })
    if (!meeting) throw new Error('Invalid meeting id')

    await meeting.requestToJoin.push({ userId, nameForAnonymous: name, status: 'Anonymous' })
    await meeting.save()

    return { status: 200, success: 'Successfully request to join' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed request to join' }
  }
}

module.exports = {
  anonymousRequestToJoinMeetingService
}
