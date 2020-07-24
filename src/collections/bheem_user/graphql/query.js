const graphql = require('graphql')

const { getAllUserService } = require('../services')
const { BheemUserType } = require('./type')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList
} = graphql

const bheemGetAllUser = {
  type: new GraphQLList(BheemUserType),
  args: {
    email: { type: GraphQLString }
  },
  resolve (parent, args) {
    return getAllUserService()
  }
}
module.exports = {
  bheemGetAllUser
}
