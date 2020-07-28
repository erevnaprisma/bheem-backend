const jwt = require('jsonwebtoken')
const config = require('config')

const accessTokenValidate = async (resolve, parent, args, context, info) => {
  // console.log('info===>', info)
  // console.log('context===>', context.req.headers.accesstoken)
  // console.log('context.req.headers===>', context.req.headers)
  const { accesstoken } = context.req.headers
  // if (!args.access_token) return { status: 400, error: 'Token needed' }
  // const at = await jwt.verify(accesstoken, config.get('privateKeyMerchant'))

  console.log('accessTokenValidate middleware at: ', accesstoken)
  try {
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    console.log('bodyAt===>', bodyAt)
    // await jwt.verify(args.access_token, config.get('privateKey'))
    // args.isLoggedInWithToken = true
  } catch (err) {
    console.log('err===>', err)
    throw new Error('Invalid Access Token')
  }
  // console.log('accessTokenValidate middleware at: ', at)
  const result = resolve(parent, args, context, info)
  return result
}
const accessTokenValidateMiddleware = {
  Mutation: {
    createCourse: accessTokenValidate
  },
  RootQueryType: {
    getAllCourses: accessTokenValidate
  }
}
module.exports = accessTokenValidateMiddleware
