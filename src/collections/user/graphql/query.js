const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { userLogin, getUserProfile, fetchAllUsers, fetchDetailUser } = require('../services')
const { getAllUser } = require('../../../utils/services/mongoServices')
const { AuthType, UserType } = require('./type')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInt
} = graphql

const login = {
  type: AuthType,
  args: {
    access_token: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString }
  },
  async resolve (parent, args) {
    return userLogin(args.username, args.password, args.access_token, args.isLoggedInWithToken)
  }
}

const getProfile = {
  type: AuthType,
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLID) }
  },
  async resolve (parent, args, context) {
    return getUserProfile(args.user_id)
  }
}
const getDetailUser = {
  type: new GraphQLObjectType({
    name: 'getDetailUser' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      data_detail: { type: UserType }
    })
  }),
  args: {
    id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchDetailUser(args, context)
  }
}

const allUser = {
  type: new GraphQLList(UserType),
  args: {
    email: { type: GraphQLString }
  },
  resolve (parent, args) {
    return getAllUser()
  }
}

const getAllUsers = {
  type: new GraphQLObjectType({
    name: 'getAllUsers' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(UserType) },
      count: { type: GraphQLLong },
      page_count: { type: GraphQLLong }
    })
  }),
  args: {
    page_size: { type: GraphQLInt },
    page_index: { type: GraphQLInt },
    string_to_search: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return fetchAllUsers(args, context)
  }
}

module.exports.getDetailUser = getDetailUser
module.exports.getAllUsers = getAllUsers
module.exports.login = login
module.exports.getProfile = getProfile
module.exports.allUser = allUser
