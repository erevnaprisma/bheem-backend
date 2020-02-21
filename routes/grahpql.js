const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const schema = require('../schema')

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

Router.all('/', 
  graphqlHTTP((request, response, graphQLParams) =>({
    schema: schema,
    pretty: true,
    graphiql: true,
  //   rootValue: root
  })));

module.exports = Router