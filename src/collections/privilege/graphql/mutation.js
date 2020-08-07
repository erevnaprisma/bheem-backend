const graphql = require('graphql')
const { PrivilegeType } = require('./type')
const { doPrivilegeCheckboxSubmit, doCreatePrivilege, doUpdatePrivilege, doDeletePrivilege } = require('../services')

const {
  GraphQLBoolean,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType
} = graphql

const createPrivilege = {
  type: new GraphQLObjectType({
    name: 'createPrivilege' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: PrivilegeType }
    })
  }),
  args: {
    entity: { type: GraphQLString },
    description: { type: GraphQLString },
    role_id: { type: GraphQLString },
    title: { type: GraphQLString },
    name: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return doCreatePrivilege(args, context)
  }
}
const updatePrivilege = {
  type: new GraphQLObjectType({
    name: 'updatePrivilege' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: PrivilegeType }
    })
  }),
  args: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    role_id: { type: GraphQLString },
    description: { type: GraphQLString },
    entity: { type: GraphQLString },
    name: { type: GraphQLString },
    status: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return doUpdatePrivilege(args, context)
  }
}
const deletePrivilege = {
  type: new GraphQLObjectType({
    name: 'deletePrivilege' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString }
    })
  }),
  args: {
    _id: { type: GraphQLID }
  },
  async resolve (parent, args, context) {
    return doDeletePrivilege(args, context)
  }
}
const privilegeCheckboxSubmit = {
  type: new GraphQLObjectType({
    name: 'privilegeCheckboxSubmit' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString }
    })
  }),
  args: {
    role_id: { type: GraphQLString },
    // privilege_ids_flag: { type: GraphQLList(GraphQLString) }
    privilege_ids_flag: {
      type: GraphQLList(new GraphQLInputObjectType({
        name: 'privilegeIdFlag',
        fields: () => ({
          privilege_id: { type: GraphQLString },
          flag: { type: GraphQLBoolean }
        })
      }))
    }
  },
  async resolve (parent, args, context) {
    return doPrivilegeCheckboxSubmit(args, context)
  }
}

module.exports = {
  privilegeCheckboxSubmit,
  createPrivilege,
  updatePrivilege,
  deletePrivilege
}
