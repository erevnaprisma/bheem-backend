// const jwt = require('jsonwebtoken')

const isAuth = async (
  resolve,
  parent,
  args,
  context,
  info
) => {
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
