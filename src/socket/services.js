// Model
const Meeting = require('../collections/bheem_meeting/Model')

// Services
const {
  requestToJoinMeetingService,
  admitParticipantToJoinService,
  rejectParticipantToJoinService,
  removeUserFromParticipantsService
} = require('../collections/bheem_meeting/services/Meeting')

const requestToJoin = async (socket, io) => {
  // Request to Join
  socket.on('requestToJoin', async (msg) => {
    if (!msg.socketId) return socket.emit('meetingError', 'Invalid socket id')
    if (!msg.userId) return socket.emit('meetingError', 'Invalid user id')
    if (!msg.username) return socket.emit('meetingError', 'Invalid username')
    if (!msg.meetingId) return socket.emit('meetingError', 'Invalid meeting id')

    const message = {
      socketId: msg.socketId,
      userId: msg.userId,
      username: msg.username,
      meetingId: msg.meetingId
    }

    let meeting

    try {
      // Validate Meeting
      meeting = await Meeting.findOne({ _id: message.meetingId })
      if (!meeting) return socket.emit('meetingError', 'Meeting not found')
    } catch (err) {
      return socket.emit('meetingError', 'Meeting not found')
    }

    const response = await requestToJoinMeetingService(msg.meetingId, msg.userId)
    if (response.status === 400) return socket.emit('meetingError', response.error || 'Something went wrong')

    if (response.success === 'Successfully request to join meeting') {
      // send request to host
      io.of('/participant').to(msg.meetingId).emit('sendRequestToHost', message)

      // send current situation to user that request
      socket.emit('needPermission', 'Waiting for host approval')
    }

    if (response.success === 'Successfully join meeting') {
      socket.join(msg.meetingId, () => {
        console.log(`${msg.username} has joined the room`)
        socket.emit('userPermission', 'Admit')
      })
    }
  })
}

const admitOrReject = async (socket, io) => {
  // Admit User to Join
  socket.on('admitUserToJoinHost', async (msg) => {
    const response = await admitParticipantToJoinService(msg.meetingId, msg.userId, msg.hostId)

    if (response.status === 400) return socket.emit('meetingError', response.error || 'Something went wrong')

    io.of('/participant').to(msg.socketId).emit('userPermission', 'Admit')
  })

  // Reject User to Join
  socket.on('rejectUserToJoinHost', async (msg) => {
    const response = await rejectParticipantToJoinService(msg.meetingId, msg.userId, msg.hostId)

    if (response.status === 400) return socket.emit('meetingError', response.error || 'Something went wrong')

    io.of('/participant').to(msg.socketId).emit('userPermission', 'Reject')
  })
}

const createMeeting = (socket) => {
  socket.on('createMeeting', async (msg) => {
    socket.join(msg.meetingId, () => {
      console.log('Host successfully join room')
    })
  })
}

const ifUserSuddenlyOff = (socket, io) => {
  socket.on('userSuddenlyOff', async (msg) => {
    if (!msg.userId) return socket.emit('meetingError', 'Invalid user id')
    if (!msg.meetingId) return socket.emit('meetingError', 'Invalid meeting id')

    try {
      await removeUserFromParticipantsService(msg.userId, msg.meetingId)
    } catch (err) {
      return socket.emit('meetingError', err.message || 'Something went wrong')
    }

    socket.emit('successfullyRemovedUser', 'successfullyRemovedUser')
  })
}

module.exports = {
  requestToJoin,
  admitOrReject,
  createMeeting,
  ifUserSuddenlyOff
}
