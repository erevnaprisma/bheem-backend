// Model
const Meeting = require('../collections/bheem_meeting/Model')
const MeetingList = require('../collections/bheem_meeting_list/Model')
const User = require('../collections/bheem_user/Model')

// Services
const {
  requestToJoinMeetingService,
  admitParticipantToJoinService,
  rejectParticipantToJoinService,
  removeUserFromParticipantsService,
  endMeetingService,
  getCurrentMeetingListService,
  lockMeetingService
} = require('../collections/bheem_meeting/services/Meeting')

const {
  anonymousRequestToJoinMeetingService,
  anonymousAdmitParticipantToJoinService,
  anonymousRejectParticipantToJoinService
} = require('../collections/bheem_meeting/services/AnonymousMeeting')

const {
  userAudioVideoUpdate,
  userAudioVideoUpdateAll,
  joinMeetingList,
  removeFromMeetingList,
  getSpesificUserMeetingList
} = require('../collections/bheem_meeting_list/services')

var ObjectId = require('mongodb').ObjectID

const requestToJoin = async (socket, io) => {
  // Request to Join
  socket.on('requestToJoin', async (msg) => {
    if (!msg.username) return socket.emit('meetingError', 'Invalid username')
    if (!msg.meetingId) return socket.emit('meetingError', 'Invalid meeting id')
    if (!msg.socketId) return socket.emit('meetingError', 'Invalid socket id')

    const message = {
      userId: msg.userId,
      username: msg.username,
      meetingId: msg.meetingId,
      status: 'Auth',
      socketId: msg.socketId,
      audio: msg.audio,
      video: msg.video
    }

    let meeting
    let host

    try {
      // Validate Meeting
      meeting = await Meeting.findOne({ _id: msg.meetingId })
      if (!meeting) return socket.emit('meetingError', 'Meeting not found')

      // Get host info
      host = await User.findOne({ _id: meeting.hosts[0].userId })
    } catch (err) {
      return socket.emit('meetingError', err.message || 'Meeting not found')
    }

    var waitingMessage = {
      message: 'Waiting for host approval',
      hostName: host.fullName,
      meetingTitle: meeting.title
    }

    // if participant is anonymous
    if (msg.anonymous) {
      if (!msg.meetingId) return socket.emit('meetingError', 'Invalid meeting id')
      if (!msg.username) return socket.emit('meetingError', 'Invalid name')

      const userId = new ObjectId().toString()

      const response = await anonymousRequestToJoinMeetingService(msg.meetingId, msg.username, userId)

      if (response.status === 400) return socket.emit('meetingError', response.error || 'Something went wrong')

      // if meeting has no permission
      if (response.success === 'Successfully join meeting') {
        socket.join(msg.meetingId, () => {
          console.log(`${msg.username} has joined the room`)
        })

        // join meeting list with default audio false and video false
        try {
          await joinMeetingList(msg.meetingId, userId, msg.audio, msg.video, msg.socketId)
        } catch (err) {
          return socket.emit('meetingError', err.message || 'Failed create meeting list')
        }

        console.log('BEFORE MEETING LIST')

        // notify everyon that someone is joining meeting list
        io.of('/participant').to(msg.meetingId).emit('meetingList', { userId: msg.userId, audio: msg.audio, video: msg.video, socketId: msg.socketId })

        return socket.emit('userPermission', { message: 'ADMIT', fullName: msg.username, userId, meetingId: msg.meetingId })
      }

      // if meeting permission is Yes
      if (response.success === 'Successfully request to join') {
        const AnonymousMessage = {
          userId,
          username: msg.username,
          meetingId: msg.meetingId,
          status: 'Anonymous',
          socketId: msg.socketId,
          audio: msg.audio,
          video: msg.video
        }

        // send request to host
        io.of('/participant').to(msg.meetingId).emit('sendRequestToHost', AnonymousMessage)

        // add user id to anonymous participant
        waitingMessage.userId = userId

        // join waiting list room
        socket.join(msg.meetingId + '/waitingList', () => {
          console.log(`${msg.username} has join waiting list`)
        })

        return socket.emit('needPermission', waitingMessage)
      }
    }

    // check user id is null or undefined
    if (!msg.userId) return socket.emit('meetingError', 'Invalid user id')

    const user = await User.findOne({ _id: msg.userId })

    // if participant already authenticate
    const response = await requestToJoinMeetingService(msg.meetingId, msg.userId)
    if (response.status === 400) return socket.emit('meetingError', response.error || 'Something went wrong')

    // if meeting has no permission
    if (response.success === 'Successfully join meeting') {
      socket.join(msg.meetingId, () => {
        console.log(`${user.fullName} has joined the room`)
      })

      // join meeting list with default audio false and video false
      try {
        await joinMeetingList(msg.meetingId, msg.userId, msg.audio, msg.video, msg.socketId)
      } catch (err) {
        return socket.emit('meetingError', err.message || 'Failed create meeting list')
      }

      // notify everyon that someone is joining meeting list
      io.of('/participant').to(msg.meetingId).emit('meetingList', { userId: msg.userId, audio: msg.audio, video: msg.video, socketId: msg.socketId })

      return socket.emit('userPermission', { message: 'ADMIT', fullName: user.fullName, userId: user._id, meetingId: msg.meetingId })
    }

    if (response.success === 'Successfully request to join meeting') {
      // send request to host
      io.of('/participant').to(msg.meetingId).emit('sendRequestToHost', message)

      // join waiting list room
      socket.join(msg.meetingId + '/waitingList', () => {
        console.log(`${msg.username} has join waiting list`)
      })

      // send current situation to user that request
      return socket.emit('needPermission', waitingMessage)
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
    if (msg.status === 'Anonymous') {
      const response = await anonymousAdmitParticipantToJoinService(msg.meetingId, msg.hostId, msg.userId, msg.username)

      if (response.status === 400) return socket.emit('meetingError', response.error || 'Something went wrong')

      // join meeting list with default audio false and video false
      try {
        await joinMeetingList(msg.meetingId, msg.userId, msg.audio, msg.video, msg.socketId)
      } catch (err) {
        return socket.emit('meetingError', err.message || 'Failed create meeting list')
      }

      // send message to user
      io.of('/participant').to(msg.meetingId + '/waitingList').emit('userPermission', { message: 'ADMIT', userId: msg.userId, fullName: msg.username, role: 'Anonymous', meetingId: msg.meetingId })

      // notify everyon that someone is joining meeting list
      io.of('/participant').to(msg.meetingId).emit('meetingList', { userId: msg.userId, audio: msg.audio, video: msg.video, socketId: msg.socketId })

      // send successfully admit response to host to erase participant from host
      return socket.emit('succeessfullyAdmit', { userId: msg.userId, fullName: msg.username, role: 'participant' })
    }

    const response = await admitParticipantToJoinService(msg.meetingId, msg.userId, msg.hostId)

    if (response.status === 400) return socket.emit('meetingError', response.error || 'Something went wrong')

    const user = await User.findOne({ _id: msg.userId })
    if (!msg.userId) return socket.emit('meetingError', 'Invalid user id')

    // create new meeting list with default audio false and video false
    try {
      await joinMeetingList(msg.meetingId, msg.userId, msg.audio, msg.video, msg.socketId)
    } catch (err) {
      return socket.emit('meetingError', err.message || 'Failed create meeting list')
    }

    // send message to user
    io.of('/participant').to(msg.meetingId + '/waitingList').emit('userPermission', { message: 'ADMIT', userId: msg.userId, fullName: msg.username, role: 'Participant', meetingId: msg.meetingId })

    // notify everyon that someone is joining meeting list
    io.of('/participant').to(msg.meetingId).emit('meetingList', { userId: msg.userId, audio: msg.audio, video: msg.video, socketId: msg.socketId })

    // send successfully admit response to host to erase participant from host
    return socket.emit('succeessfullyAdmit', { userId: user._id, fullName: user.fullName, role: 'participant' })
  })

  // Reject User to Join
  socket.on('rejectUserToJoinHost', async (msg) => {
    if (msg.status === 'Anonymous') {
      const response = await anonymousRejectParticipantToJoinService(msg.meetingId, msg.userId, msg.hostId)

      if (response.status === 400) return socket.emit('meetingError', response.error || 'Something went wrong')

      // io.of('/participant').to(msg.socketId).emit('userPermission', 'REJECT')
      io.of('/participant').to(msg.meetingId + '/waitingList').emit('userPermission', { message: 'REJECT', userId: msg.userId })

      // send successfully admit response to host to erase participant from host
      return socket.emit('successfullyReject', { userId: msg.userId })
    }
    const response = await rejectParticipantToJoinService(msg.meetingId, msg.userId, msg.hostId)

    if (response.status === 400) return socket.emit('meetingError', response.error || 'Something went wrong')

    const user = await User.findOne({ _id: msg.userId })
    if (!msg.userId) return socket.emit('meetingError', 'Invalid user id')

    // io.of('/participant').to(msg.socketId).emit('userPermission', 'REJECT')
    io.of('/participant').to(msg.meetingId + '/waitingList').emit('userPermission', { message: 'REJECT', userId: msg.userId })

    // send successfully admit response to host to erase participant from host
    socket.emit('successfullyReject', { userId: user._id })
  })
}

const createMeeting = (socket) => {
  socket.on('createMeeting', async (msg) => {
    try {
      const meetingList = []

      // get hosts list
      const { hosts } = await Meeting.findOne({ _id: msg.meetingId }).populate('hosts.userId').select('hosts -_id')

      let newHost

      for (const host of hosts) {
        const getUserMeetingList = await MeetingList.findOne({ meetingId: msg.meetingId })
        const hostId = await (host.userId._id).toString()
        const userInfo = await getUserMeetingList.meetingList.find(e => e.userId === hostId)

        newHost = {
          fullName: host.userId.fullName,
          role: 'Host',
          userId: host.userId._id,
          audio: userInfo.audio,
          video: userInfo.video,
          socketId: userInfo.socketId
        }

        meetingList.push(newHost)
      }

      await socket.emit('hostGetMeetingList', meetingList)
    } catch (err) {
      return socket.emit('meetingError', err.message || 'Failed get meeting list')
    }

    // host create meeting room
    socket.join(msg.meetingId, () => {
      console.log('Host successfully join room')
    })

    // host create waiting list room
    socket.join(msg.meetingId + '/waitingList', () => {
      console.log('Host successfully join waiting list')
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

    var userInfo

    try {
      const response = await getSpesificUserMeetingList(msg.meetingId, msg.userId)

      if (response.status === 400) {
        return socket.emit('meetingError', response.error || 'Failed get specific user info')
      }
      userInfo = await response.userInfo
    } catch (err) {
      return socket.emit('meetingError', err.message || 'Failed get specific user info')
    }

    // broadcast message to all user in meeting
    await io.of('/participant').to(msg.meetingId).emit('userHasJoinMeeting', { message: `${msg.fullName} has join meeting`, fullName: msg.fullName, role: 'participant', userId: msg.userId, userInfo })

    try {
      const meetingList = []
      const waitingList = []

      // get hosts list
      const { hosts } = await Meeting.findOne({ _id: msg.meetingId }).populate('hosts.userId').select('hosts -_id')

      let newHost

      for (const host of hosts) {
        const getUserMeetingList = await MeetingList.findOne({ meetingId: msg.meetingId })
        const hostId = await (host.userId._id).toString()
        const userInfo = await getUserMeetingList.meetingList.find(e => e.userId === hostId)

        newHost = {
          fullName: host.userId.fullName,
          role: 'Host',
          userId: host.userId._id,
          audio: userInfo.audio,
          video: userInfo.video,
          socketId: userInfo.socketId
        }

        meetingList.push(newHost)
      }

      const { participants, requestToJoin } = await Meeting.findOne({ _id: msg.meetingId })

      let newParticipantList
      let newRequestList

      // get meeting list and send to user
      for await (const participant of participants) {
        if (participant.status === 'Anonymous') {
          const getUserMeetingList = await MeetingList.findOne({ meetingId: msg.meetingId })
          const userInfo = await getUserMeetingList.meetingList.find(e => e.userId === participant.userId)

          newParticipantList = {
            fullName: participant.nameForAnonymous,
            role: 'Participant',
            userId: participant.userId,
            audio: userInfo.audio,
            video: userInfo.video,
            socketId: userInfo.socketId
          }
          meetingList.push(newParticipantList)
        } else {
          const getUserMeetingList = await MeetingList.findOne({ meetingId: msg.meetingId })
          const userInfo = await getUserMeetingList.meetingList.find(e => e.userId === participant.userId)

          const user = await User.findOne({ _id: participant.userId })
          newParticipantList = {
            fullName: user.fullName,
            role: 'Participant',
            userId: user._id,
            audio: userInfo.audio,
            video: userInfo.video,
            socketId: userInfo.socketId
          }
          meetingList.push(newParticipantList)
        }
      }

      socket.emit('meetingList', { meetingList })

      // get new waiting list and send to host
      if (requestToJoin.length !== 0) {
        for (const requestedUser of requestToJoin) {
          if (requestedUser.status === 'Anonymous') {
            newRequestList = {
              userId: requestedUser.userId,
              username: requestedUser.nameForAnonymous,
              meetingId: msg.meetingId,
              status: 'Anonymous'
            }
            waitingList.push(newRequestList)
          } else {
            const currentRequestedUser = await User.findOne({ _id: requestedUser.userId })
            newRequestList = {
              userId: requestedUser.userId,
              username: currentRequestedUser.fullName,
              meetingId: msg.meetingId,
              status: 'Auth'
            }
            waitingList.push(newRequestList)
          }
        }
      } else {
        return io.of('/participant').to(msg.meetingId).emit('newWaitingList', waitingList)
      }

      return io.of('/participant').to(msg.meetingId).emit('newWaitingList', waitingList)
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

const lockMeeting = async (socket, io) => {
  socket.on('meetingHasCreated', async (msg) => {
    if (!msg.meetingId) return socket.emit('meetingError', 'Invalid meeting id')

    try {
      const response = await lockMeetingService(msg.meetingId)
      if (response.status === 200) {
        return io.of('/participant').to(msg.meetingId).emit('meetingStatus', { message: 'Meeting has been lock' })
      } else if (response.status === 400) {
        throw new Error(response.error)
      }
    } catch (err) {
      return socket.emit('meetingError', err.message || 'Failed lock meeting')
    }
  })
}

const audioVideohandler = (socket, io) => {
  socket.on('hostMuteAndVideoHandler', async (msg) => {
    // yang harus dikirim oleh frontend :
    // 1. msg.code ('specific', 'all')
    // 2. msg.userId
    // 3. msg.meetingId
    // 4. msg.type ('audio', 'video')
    // 5. msg.value (true, false)

    if (msg.code === 'specific') {
      try {
        const { error } = await MeetingList.updateFlag(msg)
        if (error) throw new Error(error.details[0].message)

        const response = await userAudioVideoUpdate(msg.meetingId, msg.userId, msg.type, msg.value)

        if (response.status === 400) {
          return socket.emit('meetingError', response.error || 'Failed change audio or video')
        }

        return io.of('/participant').to(msg.meetingId).emit('participantMuteAndVideoHandler', { userId: msg.userId, type: msg.type, value: msg.value, code: msg.code })
      } catch (err) {
        return socket.emit('meetingError', err.message || 'Failed change audio or video for specific user')
      }
    }

    if (msg.code === 'all') {
      try {
        const { error } = await MeetingList.updateFlagForAll(msg)
        if (error) throw new Error(error.details[0].message)

        const response = await userAudioVideoUpdateAll(msg.meetingId, msg.type, msg.value)

        if (response.status === 400) {
          return socket.emit('meetingError', response.error || 'Failed change all user audio or video')
        }

        return io.of('/participant').to(msg.meetingId).emit('participantMuteAndVideoHandler', { type: msg.type, value: msg.value, code: msg.code })
      } catch (err) {
        return socket.emit('meetingError', err.message || 'Failed change audio or video for all')
      }
    }
  })
}

const removeFromMeetingListHandler = (socket, io) => {
  socket.on('removeFromMeetingList', async msg => {
    try {
      if (!msg.meetingId) throw new Error('Invalid meeting id')
      if (!msg.userId) throw new Error('Invalid user id')

      await removeFromMeetingList(msg.meetingId, msg.userId)
    } catch (err) {
      return socket.emit('meetingError', err.message || 'Failed remove from meeting list')
    }
  })
}

module.exports = {
  requestToJoin,
  admitOrReject,
  createMeeting,
  ifUserSuddenlyOff,
  joinRoomAndBroadcastToMeeting,
  broadcastEndMeeting,
  lockMeeting,
  audioVideohandler,
  removeFromMeetingListHandler
}
