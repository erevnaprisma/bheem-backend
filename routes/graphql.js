const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('../schema')
const { applyMiddleware } = require('graphql-middleware')
const authorizationMiddlewares = require('../middlewares/authorization')

const Router = express.Router()

applyMiddleware(schema, authorizationMiddlewares)

Router.all('/', (req, res) => {
  return graphqlHTTP({
    schema,
    graphiql: true,
    context: { req, res }
  })(req, res)
})

module.exports = Router
