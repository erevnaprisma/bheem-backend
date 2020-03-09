const jwt = require('jsonwebtoken')
const config = require('config')

const isAuth = async (
  resolve,
  parent,
  args,
  context,
  info
) => {
  // check if token in blacklist or not
  if (args.access_token) {
    await jwt.verify(args.access_token, config.get('privateKey'))
    args.isAuth = true
  }
  return resolve(parent, args, context, info)
}

const authMiddleware = {
  // Mutation: {
  //   changeUsername: isAuth,
  //   signUp: isAuth
  //   // login: isAuth
  // },
  RootQueryType: {
    login: isAuth
  }
}

module.exports = authMiddleware
