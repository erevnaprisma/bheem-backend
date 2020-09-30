const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

const arrayMeetingList = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'Bheem_User'
  },
  audio: Boolean,
  video: Boolean,
  socketId: String
})

const meetingListSchema = new mongoose.Schema({
  meetingId: {
    type: String,
    ref: 'Bheem_Meeting'
  },
  meetingList: [arrayMeetingList]
})

meetingListSchema.statics.createMeetingList = (args) => {
  const schema = Joi.object({
    meetingId: Joi.string().required(),
    userId: Joi.string().required(),
    audio: Joi.boolean().required(),
    video: Joi.boolean().required(),
    socketId: Joi.string().required()
  })

  return schema.validate(args)
}

meetingListSchema.statics.joinMeetingList = (args) => {
  const schema = Joi.object({
    meetingId: Joi.string().required(),
    userId: Joi.string().required(),
    audio: Joi.boolean().required(),
    video: Joi.boolean().required(),
    socketId: Joi.string().required()
  })

  return schema.validate(args)
}

meetingListSchema.statics.updateFlag = (args) => {
  const schema = Joi.object({
    meetingId: Joi.string().required(),
    userId: Joi.string().required(),
    type: Joi.string().valid('audio', 'video').required(),
    code: Joi.string().valid('specific', 'all').required(),
    value: Joi.boolean()
  })

  return schema.validate(args)
}

meetingListSchema.statics.updateFlagForAll = (args) => {
  const schema = Joi.object({
    meetingId: Joi.string().required(),
    type: Joi.string().valid('audio', 'video').required(),
    value: Joi.boolean()
  })

  return schema.validate(args)
}

meetingListSchema.statics.remove = (args) => {
  const schema = Joi.object({
    meetingId: Joi.string().required(),
    userId: Joi.string().required()
  })

  return schema.validate(args)
}

module.exports = mongoose.model('Bheem_MeetingList', meetingListSchema)
