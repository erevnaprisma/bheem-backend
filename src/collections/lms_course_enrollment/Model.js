const mongoose = require('mongoose')
const { Schema } = mongoose
const ObjectId = Schema.ObjectId
// const Course = require('../lms_course/Model')
// const User = require('../user/Model')
// const Joi = require('@hapi/joi')

// avoid forward referencing
var lmsEnrollmentUser = new Schema();
// var lmsEnrollmentCourse = new Schema();

lmsEnrollmentUser.add({
  user_id: {
    type: ObjectId,
    ref: 'User'
  },
  course_id: {
    type: ObjectId,
    ref: 'lms_course'
  },
  batch: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['requested', 'approved', 'rejected'],
    default: 'requested'
  },
  created_at: {
    type: Number,
    default: Date.now
  },
  updated_at: {
    type: Number,
    default: Date.now
  },
  created_by: {
    type: ObjectId,
    ref: 'User',
    default: null
  },
  updated_by: {
    type: ObjectId,
    ref: 'User',
    default: null
  }
})
// enrollment_id ==> course_id + batch
// lmsEnrollmentCourse.add({
//   course_id: {
//     type: ObjectId,
//     ref: 'lms_course',
//     unique: true
//   },
//   users: [User],
//   status: {
//     type: String,
//     enum: ['requested', 'approved', 'rejected'],
//     default: 'requested'
//   },
//   created_at: {
//     type: Number,
//     default: Date.now
//   },
//   updated_at: {
//     type: Number,
//     default: Date.now
//   },
//   created_by: {
//     type: ObjectId,
//     ref: 'User',
//     default: null
//   },
//   updated_by: {
//     type: ObjectId,
//     ref: 'User',
//     default: null
//   },
//   batch: {
//     type: Number,
//     default: 1
//   }
// })
// merchantSchema.statics.hashing = async (password) => {
//   try {
//     const salt = await bcrypt.genSalt(10)
//     const hash = await bcrypt.hash(password, salt)
//     return hash
//   } catch (err) {
//     throw new Error(err)
//   }
// }

// const schema = new mongoose.Schema({
//   user_id: {
//     type: mongoose.SchemaTypes.ObjectId,
//     ref: 'User',
//     unique: true
//   },
//   courses: [Course.schema],
//   status: {
//     type: String,
//     enum: ['requested', 'approved', 'rejected'],
//     default: 'requested'
//   },
//   created_at: {
//     type: Number,
//     default: new Date().getTime()
//   },
//   updated_at: {
//     type: Number,
//     default: new Date().getTime()
//   },
//   created_by: {
//     type: mongoose.SchemaTypes.ObjectId,
//     ref: 'User',
//     default: null
//   },
//   updated_by: {
//     type: mongoose.SchemaTypes.ObjectId,
//     ref: 'User',
//     default: null
//   }
// })
// schema.index({ user_id: 1, 'courses._id': 1, 'courses.batch': 1 }, { unique: true })
// schema.statics.validation = (args) => Joi.object({
//   // user_id: Joi.string(),
//   // amount: Joi.number().required().greater(0)
// }).validate(args)
// merchantSchema.pre('save', function (next) {
//   const user = this
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) {
//       return next(err)
//     }

//     bcrypt.hash(user.password, salt, (err, hash) => {
//       if (err) {
//         return next(err)
//       }
//       user.password = hash
//       next()
//     })
//   })
// })
// lmsEnrollmentUser.pre('save', (next) => {
//   const data = this
//   data.created_by
//   next()
// })
lmsEnrollmentUser.index({ user_id: 1, course_id: 1, batch: 1 }, { unique: true })
// lmsEnrollmentUser.index({ user_id: 1 }, { unique: true })
// lmsEnrollmentCourse.index({ course_id: 1, 'users._id': 1, batch: 1 }, { unique: true })
// lmsEnrollmentCourse.index({ course_id: 1 })

module.exports = {
  lmsEnrollmentUser: mongoose.model('lms_course_enrollment', lmsEnrollmentUser)
  // lmsEnrollmentCourse: mongoose.model('lms_enrollment_course', lmsEnrollmentCourse)
}
