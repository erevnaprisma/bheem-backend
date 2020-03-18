const graphql = require('graphql')
const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} = graphql

const { OtpResponseType } = require('./type')
const { sendOTPService, submitOtpService } = require('../services')

const sendOtp = {
  type: OtpResponseType,
  args: {
    password: { type: new GraphQLNonNull(GraphQLString) },
    new_email: { type: new GraphQLNonNull(GraphQLString) },
    user_id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve (parent, args) {
    return sendOTPService({ password: args.password, email: args.new_email, userID: args.user_id })
  }
}

const submitOtp = {
  type: OtpResponseType,
  args: {
    otp: { type: new GraphQLNonNull(GraphQLString) },
    new_email: { type: new GraphQLNonNull(GraphQLString) },
    user_id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve (parent, args) {
    return submitOtpService({ email: args.new_email, otp: args.otp, userID: args.user_id })
  }
}

module.exports.sendOtp = sendOtp
module.exports.submitOtp = submitOtp
