const graphql = require('graphql')
const _ = require('lodash')
const GraphQLLong = require('graphql-type-long')
const { flatten } = require('../../../utils/services')
const { findUser } = require('../../../utils/services/mongoServices')
const { fetchDetailUserRoleByUserId } = require('../../user_role/services')
const Saldo = require('../../rp_saldo/Model')

const {
  GraphQLString,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} = graphql

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLID },
    user_id: { type: GraphQLString },
    full_name: { type: GraphQLString },
    username: { type: GraphQLString },
    device_id: { type: GraphQLString },
    email: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    nickname: { type: GraphQLString },
    address: { type: GraphQLString },
    role: { type: GraphQLString },
    user_privileges: { type: GraphQLList(GraphQLString) },
    created_by: { type: UserType },
    updated_by: { type: UserType },
    created_at: { type: GraphQLLong },
    updated_at: { type: GraphQLLong },
    saldo: {
      type: GraphQLInt,
      async resolve (parent) {
        const res = await Saldo.findOne({ user_id: parent.user_id }).select('saldo -_id')
        if (!res) return 0
        return res.saldo
      }
    }
  })
})

const AuthType = new GraphQLObjectType({
  name: 'Auth',
  fields: () => ({
    access_token: { type: GraphQLString },
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    role: { type: GraphQLString },
    user: {
      type: UserType,
      async resolve (parent, args) {
        return findUser(parent.user_id)
      }
    },
    user_privileges: { type: GraphQLList(GraphQLString) }
  })
})

const ChangeType = new GraphQLObjectType({
  name: 'Change',
  fields: () => ({
    new_token: { type: GraphQLString },
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

module.exports.UserType = UserType
module.exports.AuthType = AuthType
module.exports.ChangeType = ChangeType
