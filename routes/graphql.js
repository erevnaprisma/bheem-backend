const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('../schema')
const { applyMiddleware } = require('graphql-middleware')

// bheem
const authorizationMiddlewares = require('../middlewares/authorization')

// lms
const authMiddleware = require('../middlewares/auth')
const accessTokenValidateMiddleware = require('../middlewares/accessTokenFilter')
const privilegeValidateMiddleware = require('../middlewares/authorizationFilter')
const contentUrlDecode = require('../middlewares/contentUrlDecode')

const meeting = require('../src/socket/meeting')

module.exports = function (io) {
  meeting(io)

  const Router = express.Router()

  applyMiddleware(schema, authorizationMiddlewares, authMiddleware, accessTokenValidateMiddleware, privilegeValidateMiddleware, contentUrlDecode)

  return Router.all('/', (req, res) => {
    return graphqlHTTP({
      schema,
      graphiql: true,
      context: { req, res }
    })(req, res)
  })
}
