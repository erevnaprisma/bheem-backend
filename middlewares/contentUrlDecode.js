const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')

const mw = async (resolve, parent, args, context, info) => {
  // const { accesstoken } = context.headers
  // if (!args.access_token) return { status: 400, error: 'Token needed' }
  // const at = await jwt.verify(accesstoken, config.get('privateKeyMerchant'))
  if (!_.isEmpty(args.content1)) {
    args.content1 = decodeURIComponent(args.content1)
  }

  // console.log('accessTokenValidate middleware at: ', accesstoken)
  // try {
  //   const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
  //   console.log('bodyAt===>', bodyAt)
  //   // await jwt.verify(args.access_token, config.get('privateKey'))
  //   // args.isLoggedInWithToken = true
  // } catch (err) {
  //   console.log('err===>', err)
  //   throw new Error('Invalid Access Token')
  // }
  // console.log('accessTokenValidate middleware at: ', at)
  const result = resolve(parent, args, context, info)
  return result
}
const contentUrlDecode = {
  Mutation: {
    createLmsSubjectUnit: mw,
    updateLmsSubjectUnit: mw,
    createSubject: mw,
    updateSubject: mw,
    createCourse: mw,
    updateCourse: mw
  }
}
module.exports = contentUrlDecode
