// Services
const {
  requestToJoin,
  admitOrReject,
  createMeeting,
  ifUserSuddenlyOff,
  joinRoomAndBroadcastToMeeting,
  lockMeeting
} = require('./services')

const meeting = (io) => {
  io.of('/participant').on('connection', (socket) => {
    console.log('Client Connected to Socket...')

    socket.on('disconnect', (reason) => {
      console.log('Disconnected...')
    })

    createMeeting(socket)

    admitOrReject(socket, io)

    requestToJoin(socket, io)

    ifUserSuddenlyOff(socket, io)

    joinRoomAndBroadcastToMeeting(socket, io)

    lockMeeting(socket, io)
  })
}

module.exports = meeting
