const graphql = require('graphql')

const { getAllUserService } = require('../services')
const { UserType } = require('./type')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList
} = graphql

const getAllUser = {
  type: new GraphQLList(UserType),
  args: {
    email: { type: GraphQLString }
  },
  resolve (parent, args) {
    return getAllUserService()
  }
}
module.exports = {
  getAllUser
}
