// Model
const Meeting = require('../collections/bheem_meeting/Model')
const User = require('../collections/bheem_user/Model')

// Services
const {
  requestToJoinMeetingService,
  admitParticipantToJoinService,
  rejectParticipantToJoinService,
  removeUserFromParticipantsService,
  endMeetingService,
  getCurrentMeetingListService
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
      return socket.emit('meetingError', err.messagee || 'Meeting not found')
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

    const user = await User.findOne({ _id: msg.userId })
    if (!msg.userId) return socket.emit('meetingError', 'Invalid user id')

    // send message to user
    io.of('/participant').to(msg.socketId).emit('userPermission', { message: 'ADMIT', userId: user._id, fullName: user.fullName, role: 'participant', meetingId: msg.meetingId })

    // send successfully admit response to host to erase participant from host
    socket.emit('succeessfullyAdmit', { userId: user._id, fullName: user.fullName, role: 'participant' })
  })

  // Reject User to Join
  socket.on('rejectUserToJoinHost', async (msg) => {
    const response = await rejectParticipantToJoinService(msg.meetingId, msg.userId, msg.hostId)

    if (response.status === 400) return socket.emit('meetingError', response.error || 'Something went wrong')

    const user = await User.findOne({ _id: msg.userId })
    if (!msg.userId) return socket.emit('meetingError', 'Invalid user id')

    io.of('/participant').to(msg.socketId).emit('userPermission', 'REJECT')

    // send successfully admit response to host to erase participant from host
    socket.emit('successfullyReject', { userId: user._id })
  })
}

const requestToJoinAsAnonymous = async (socket, io) => {
  
}

const admitOrRejectAnonymous = async (socket, io) => {

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

const joinRoomAndBroadcastToMeeting = (socket, io) => {
  socket.on('afterUserJoinMeeting', async (msg) => {
    // add user to room
    socket.join(msg.meetingId, () => {
      console.log(`${msg.fullName} has join room`)
    })

    // broadcast message to all user in meeting
    io.of('/participant').to(msg.meetingId).emit('userHasJoinMeeting', { message: `${msg.fullName} has join meeting`, fullName: msg.fullName, role: 'participant', userId: msg.userId })

    // send meetingList to user
    try {
      const response = await getCurrentMeetingListService(msg.meetingId)
      if (response.status === 400) return socket.emit('meetingError', response.error || 'Something went wrong')

      socket.emit('meetingList', response)
    } catch (err) {
      return socket.emit('meetingError', err.message || 'Something went wrong')
    }
  })
}

const broadcastEndMeeting = (socket, io) => {
  socket.on('hostEndMeeting', async (msg) => {
    const response = await endMeetingService(msg.meetingId)

    if (response.status === 400) return socket.emit('meetingError', response.error || 'Something went wrong')

    io.of('/participant').to(msg.meetingId).emit('endMeeting', { message: 'Meeting has ended' })
  })
}

module.exports = {
  requestToJoin,
  admitOrReject,
  createMeeting,
  ifUserSuddenlyOff,
  joinRoomAndBroadcastToMeeting,
  broadcastEndMeeting
}
