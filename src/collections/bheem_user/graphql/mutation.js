const graphql = require('graphql')

const { loginService, signUpService, logoutService, changePasswordService } = require('../services')
const { BheemLoginType, BheemLogoutType, BheemSignUpType, BheemChangePasswordType } = require('../graphql/type')

const {
  GraphQLString,
  GraphQLNonNull
} = graphql

const bheemSignUp = {
  type: BheemSignUpType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    fullName: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    deviceId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return signUpService(args.email, args.deviceId, args.fullName, args.lastName, args.firstName)
  }
}

const bheemLogin = {
  type: BheemLoginType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args, { req, res }) {
    return loginService(args.email, args.password, { req, res })
  }
}

const bheemLogout = {
  type: BheemLogoutType,
  args: {
    token: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return logoutService(args.token)
  }
}

const bheemChangePassword = {
  type: BheemChangePasswordType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return changePasswordService(args.userId, args.newPassword, args.password)
  }
}

module.exports = {
  bheemSignUp,
  bheemLogin,
  bheemLogout,
  bheemChangePassword
}
