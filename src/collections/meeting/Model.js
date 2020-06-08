const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

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

const removedParticipants = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User'
  }
})

const meetingSchema = new mongoose.Schema({
  title: String,
  hosts: {
    type: [hostsSchema]
  },
  participants: {
    type: [participantsSchema],
    default: []
  },
  removedParticipants: {
    type: [removedParticipants],
    default: []
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
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

meetingSchema.statics.validate = (args) => {
  const schema = Joi.object({
    meetingId: Joi.objectId(),
    title: Joi.string().min(3).max(50),
    host: Joi.objectId(),
    participant: Joi.objectId(),
    createdBy: Joi.objectId(),
    startDate: Joi.string(),
    endDate: Joi.string()
  })

  return schema.validate(args)
}

module.exports = mongoose.model('Meeting', meetingSchema)
