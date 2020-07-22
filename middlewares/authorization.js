// const { checkerBlacklist } = require('../src/collections/blacklist/services')
// const jwt = require('jsonwebtoken')
// const config = require('config')

// const isAuthorized = async (resolve, parent, args, context, info) => {
//   try {
//     if (!context.req.headers.authorization) throw new Error('Token required')
//     const { authorization } = context.req.headers

//     await checkerBlacklist(authorization)

//     await jwt.verify(authorization, config.get('privateKey'))
//   } catch (err) {
//     return { status: 400, error: err.message || 'Invalid Token' }
//   }
//   return resolve(parent, args, context, info)
// }

// const authorizationMiddlewares = {
//   Mutation: {
//     // createMeeting: isAuthorized,
//     finishMeeting: isAuthorized
//   },
//   RootQueryType: {

//   }
// }

// module.exports = authorizationMiddlewares
