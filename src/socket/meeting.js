// Services
const {
  requestToJoin,
  admitOrReject,
  createMeeting,
  ifUserSuddenlyOff
} = require('./services')

const meeting = (io) => {
  io.of('/participant').on('connection', (socket) => {
    console.log('Client Connected to Socket...')

    createMeeting(socket)

    admitOrReject(socket, io)

    requestToJoin(socket, io)

    ifUserSuddenlyOff(socket, io)
  })
}

module.exports = meeting
