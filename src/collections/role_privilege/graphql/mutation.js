const graphql = require('graphql')
const { RoleprivilegeType } = require('./type')
const { doCreateRoleprivilege, doUpdateRoleprivilege, doDeleteRoleprivilege } = require('../services')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLID
} = graphql

const createRoleprivilege = {
  type: new GraphQLObjectType({
    name: 'createRoleprivilege' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: RoleprivilegeType }
    })
  }),
  args: {
    role_id: { type: GraphQLString },
    privilege_id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return doCreateRoleprivilege(args, context)
  }
}
const updateRoleprivilege = {
  type: new GraphQLObjectType({
    name: 'updateRoleprivilege' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: RoleprivilegeType }
    })
  }),
  args: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    name: { type: GraphQLString },
    status: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return doUpdateRoleprivilege(args, context)
  }
}
const deleteRoleprivilege = {
  type: new GraphQLObjectType({
    name: 'deleteRoleprivilege' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString }
    })
  }),
  args: {
    _id: { type: GraphQLID }
  },
  async resolve (parent, args, context) {
    return doDeleteRoleprivilege(args, context)
  }
}
module.exports = {
  createRoleprivilege,
  updateRoleprivilege,
  deleteRoleprivilege
}
