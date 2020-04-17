const jwt = require('jsonwebtoken')
const config = require('config')
const express = require('express')
var cors = require('cors')

const app = express()

const { checkerBlacklist, checkerBlacklistMerchant, checkerBlacklistInstitution } = require('../src/collections/blacklist/services')

const isAuth = async (
  resolve,
  parent,
  args,
  context,
  info
) => {
  // check if token in blacklist or not
  await checkerBlacklist(args.access_token)

  if (args.access_token) {
    await jwt.verify(args.access_token, config.get('privateKey'))
    args.isLoggedInWithToken = true
  } else {
    args.isLoggedInWithToken = false
  }
  return resolve(parent, args, context, info)
}

const isAuthMerchant = async (
  resolve,
  parent,
  args,
  context,
  info
) => {
  // cors
  app.use(cors())

  // check if token in blacklist or not
  await checkerBlacklistMerchant(args.access_token)

  if (args.access_token) {
    try {
      await jwt.verify(args.access_token, config.get('privateKeyMerchant'))
      args.isLoggedInWithToken = true
    } catch (err) {
      args.isLoggedInWithToken = false
    }
  } else {
    args.isLoggedInWithToken = false
  }
  return resolve(parent, args, context, info)
}

const isAuthInstitution = async (
  resolve,
  parent,
  args,
  context,
  info
) => {
  // check if token in blacklist or not
  await checkerBlacklistInstitution(args.access_token)

  if (args.access_token) {
    try {
      await jwt.verify(args.access_token, config.get('privateKeyInstitution'))
      args.isLoggedInWithToken = true
    } catch (err) {
      args.isLoggedInWithToken = false
    }
  } else {
    args.isLoggedInWithToken = false
  }
  return resolve(parent, args, context, info)
}

const token = async (
  resolve,
  parent,
  args,
  context,
  info
) => {
  if (!args.access_token) return { status: 400, error: 'Token needed' }

  await checkerBlacklist(args.access_token)

  await jwt.verify(args.access_token, config.get('privateKey'), (err, res) => {
    if (err) {
      if (err.message === 'jwt expired') {
        const res = generateAccessToken(args)
        args.newToken = res
      } else if (err) throw new Error(err)
    }
  })
  return resolve(parent, args, context, info)
}

const corsMiddleware = (
  resolve,
  parent,
  args,
  context,
  info
) => {
  // cors
  app.use(cors())

  return resolve(parent, args, context, info)
}

const authMiddleware = {
  Mutation: {
    changeUserName: token,
    changeUserPassword: token,
    // changeUserEmail: token,
    changeUserProfile: token,
    // signUp: isAuth
    // login: isAuth,
    signUpMerchant: corsMiddleware,
    logoutMerchant: corsMiddleware
  },
  RootQueryType: {
    login: isAuth,
    loginMerchant: isAuthMerchant,
    loginInstitution: isAuthInstitution,
    AllMerchant: corsMiddleware,
    MerchantInfo: corsMiddleware
  }
}

const generateAccessToken = (args) => {
  return jwt.sign({ user_id: args.user_id }, config.get('privateKey'))
}

module.exports = authMiddleware
