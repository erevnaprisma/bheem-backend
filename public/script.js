const socket = io('ws://localhost:3000/participant')

// let userInfo
const hostId = '5f2257c2d818e841d5f37f29'

// listening request from user
// socket.on('sendRequestToHost', (msg) => {
//   userInfo = msg
//   console.log('someone request to join')
//   document.getElementById('listRequestUser').innerHTML += `<li>${msg.username}  <button onclick="admit()">admit</button> <button onclick="reject()">reject</button></li>`
// })

// listening to meeting error
socket.on('meetingError', (msg) => {
  console.log(msg)
})

// function createMeeting () {
// //   socket.emit('createMeeting', { meetingId: document.getElementById('createMeetingId').value })
    
// }
