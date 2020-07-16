const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

const participantsSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Auth', 'Anonymous'],
    default: 'Auth'
  },
  name: {
    type: String
  }
})

const hostsSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User'
  },
  name: {
    type: String
  }
})

const removedParticipantsSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User'
  },
  name: {
    type: String
  },
  default: {
    type: String,
    enum: ['Auth', 'Anonymous'],
    default: 'Auth'
  }
})

const requestToJoinSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User'
  },
  name: {
    type: String
  },
  status: {
    type: String,
    enum: ['Auth', 'Anonymous'],
    default: 'Auth'
  }
})

const meetingSchema = new mongoose.Schema({
  title: String,
  hosts: {
    type: [hostsSchema],
    default: []
  },
  participants: {
    type: [participantsSchema],
    default: []
  },
  needPermisionToJoin: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'Yes'
  },
  requestToJoin: {
    type: [requestToJoinSchema],
    default: []
  },
  removedParticipants: {
    type: [removedParticipantsSchema],
    default: []
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SCHEDULE'],
    default: 'ACTIVE'
  },
  createdBy: {
    type: String,
    ref: 'User'
  },
  startDate: String,
  endDate: {
    type: String,
    default: null
  },
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
    endDate: Joi.string().allow('', null),
    permission: Joi.string().valid('Yes', 'No').allow('', null)
  })

  return schema.validate(args)
}

meetingSchema.statics.admitOrReject = (args) => {
  const schema = Joi.object({
    meetingId: Joi.objectId().required(),
    userId: Joi.objectId().required(),
    hostId: Joi.objectId().required()
  })

  return schema.validate(args)
}

meetingSchema.statics.validateEditedScheduleMeeting = (args) => {
  const titleRegex = /^[a-zA-Z0-9,.?/'";;=+-_()&# ]*$/i

  const schema = Joi.object({
    meetingId: Joi.objectId(),
    title: Joi.string().min(3).max(50).allow('', null).pattern(new RegExp(titleRegex, 'm')),
    startDate: Joi.string().allow('', null),
    endDate: Joi.string().allow('', null),
    permission: Joi.string().allow('', null).valid('Yes', 'No')
  })
  return schema.validate(args)
}

module.exports = mongoose.model('Meeting', meetingSchema)
