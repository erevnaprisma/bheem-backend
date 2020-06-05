const Meeting = require('./Model')
const { generateId } = require('../../utils/services')

const createMeetingService = async (title, host, createdBy, startDate, endDate) => {
  try {
    if (!title) throw new Error('Invalid title')
    if (!host) throw new Error('Invalid host')
    if (!createdBy) throw new Error('Invalid createdBy')
    if (!startDate) throw new Error('Invalid startDate')
    if (!endDate) throw new Error('Invalid endDate')

    const { error } = await Meeting.validate({ title, host, createdBy, startDate, endDate })
    if (error) throw new Error(error.details[0].message)

    const invitationMessage = 'halo'

    const currentHost = {
      userId: host
    }

    const meeting = await Meeting({
      meetingId: await generateId(),
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

module.exports = {
  createMeetingService
}
