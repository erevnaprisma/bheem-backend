const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('../schema')
const { applyMiddleware } = require('graphql-middleware')
const authorizationMiddlewares = require('../middlewares/authorization')

module.exports = function (io) {
  io.of('/participant').on('connection', (socket) => {
    console.log('Connected to Socket.io...')

    // Waiting Room
    socket.on('requestToJoinUser', (msg) => {
      const message = {
        socketId: msg.socketId,
        userId: msg.userId,
        username: msg.username
      }
      socket.emit('requestToJoinHost', message)

      socket.on('allowUserToJoinHost', (msg) => {
        io.to(msg.socketId).emit('userAllow', 'Success')
      })
    })
  })

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
