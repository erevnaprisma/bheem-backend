const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('../schema')

const Router = express.Router()

// Router.all('/', graphqlHTTP({
//   schema,
//   pretty: true,
//   graphiql: true
// }))

Router.all('/', (req, res) => {
  return graphqlHTTP({
    schema,
    graphiql: true,
    context: { req, res }
  })(req, res)
})

module.exports = Router
