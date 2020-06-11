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

const removedParticipantsSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User'
  }
})

const requestToJoinSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User'
  },
  name: {
    type: String
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
    enum: ['ACTIVE', 'INACTIVE'],
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

module.exports = mongoose.model('Meeting', meetingSchema)
