const mongoose = require('mongoose')

const participantsSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User'
  }
})

const hostsSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User'
  }
})

const meetingSchema = new mongoose.Schema({
  meetingId: String,
  title: String,
  meetingInvitation: String,
  host: {
    type: [hostsSchema]
  },
  participants: {
    type: [participantsSchema]
  },
  createdBy: {
    type: String,
    ref: 'User'
  },
  startDate: String,
  endDate: String,
  createdAt: {
    type: String
  },
  updatedAt: {
    type: String
  }
})

module.exports = mongoose.model('Meeting', meetingSchema)
