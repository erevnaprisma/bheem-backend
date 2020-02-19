var express = require('express')
var graphqlHTTP = require('express-graphql')
var { buildSchema } = require('graphql')
var schema = require('../schema')

// Graphql Schema
// var schema = buildSchema(`
//   type Query{
//     hello: String
//   }
// `)

// const root = {
//   hello: () => {
//     return 'Hello World!'
//   }
// }

const Router = express.Router();

Router.all('/', graphqlHTTP({
  schema: schema,
  pretty: true,
  graphiql: true,
//   rootValue: root
}));

module.exports = Router