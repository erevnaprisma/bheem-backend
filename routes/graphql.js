const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('../schema')
const { applyMiddleware } = require('graphql-middleware')
const authorizationMiddlewares = require('../middlewares/authorization')

const meeting = require('../src/socket/meeting')

module.exports = function (io) {
  meeting(io)

  const Router = express.Router()

  applyMiddleware(schema, authorizationMiddlewares)

  return Router.all('/', (req, res) => {
    return graphqlHTTP({
      schema,
      graphiql: true,
      context: { req, res }
    })(req, res)
  })
}
