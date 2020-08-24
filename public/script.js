const socket = io('ws://localhost:3000/participant')

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

async function createMeeting () {
  var title = document.querySelector('#title').value
  var hostId = document.querySelector('#hostId').value
  var createdBy = document.querySelector('#createdBy').value
  var startDate = document.querySelector('#startDate').value
  var endDate = document.querySelector('#endDate').value
  var permissionToJoin = document.querySelector('#permission').value

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation {
          createMeeting(title:"${title}", host:"${hostId}", createdBy:"${createdBy}", startDate:"${startDate}", endDate:"${endDate}", permissionToJoin:"${permissionToJoin}"){
            status
            error
            success
            meeting{
              id
              hosts{
                userId
              }
            }
          }
        }
      `
    })
  })
    .then(res => res.json())
    .then(async data => {
      if (data.data.createMeeting.status === '200') {

        var meetingId = data.data.createMeeting.meeting.id
        var hostId = data.data.createMeeting.meeting.hosts[0].userId

        const message = {
          meetingId: meetingId,
          hostId: hostId
        }

        document.cookie = JSON.stringify(message)
        window.location.href = 'host2.html'
      }
    })
}