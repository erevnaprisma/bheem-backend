const { checkerBlacklist } = require('../src/collections/blacklist/services')

const isAuthorized = async (resolve, parent, args, context, info) => {
  try {
    await checkerBlacklist(args.token)
    args.isTokenExpire = true
  } catch (err) {
    args.isTokenExpire = false
  }
  return resolve(parent, args, context, info)
}

const authorizationMiddlewares = {
  Mutation: {

  },
  RootQueryType: {

  }
}

module.exports = authorizationMiddlewares
