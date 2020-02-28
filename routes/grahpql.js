const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const schema = require('../schema')

const Router = express.Router();

Router.all('/', 
  graphqlHTTP({
    schema: schema,
    pretty: true,
    graphiql: true,
  //   rootValue: root
  }));

module.exports = Router