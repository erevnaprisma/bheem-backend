const graphql = require('graphql')

const { loginService, signUpService, logoutService } = require('../services')
const { LoginType, LogoutType, SignUpType } = require('../graphql/type')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID
} = graphql

const signUp = {
  type: SignUpType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    deviceId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return signUpService(args.email, args.deviceId)
  }
}

const login = {
  type: LoginType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args, { req, res }) {
    return loginService(args.email, args.password, { req, res })
  }
}

const logout = {
  type: LogoutType,
  args: {
    token: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return logoutService(args.token)
  }
}

module.exports = {
  signUp, login, logout
}
