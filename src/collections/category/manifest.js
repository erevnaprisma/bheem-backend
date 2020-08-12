const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { FileType } = require('../file/graphql/type')
const { UserType } = require('../user/graphql/type')
const Type = require('./graphql/type')
const {
  GraphQLBoolean,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType
} = graphql

const commonFields = {
  created_by: { type: UserType },
  updated_by: { type: UserType },
  created_at: { type: GraphQLLong },
  updated_at: { type: GraphQLLong }
}

const entity = 'Category'
const collection = 'category'

const fields = {
  _id: { type: GraphQLID },
  title: { type: GraphQLString },
  parent_id: { type: Type[entity + 'Type'] }
}
module.exports = {
  entity: entity,
  collection: collection,
  updateArgs: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    parent_id: { type: GraphQLString },
    toko_id: { type: GraphQLList(GraphQLString) }
  },
  createArgs: {
    title: { type: GraphQLString },
    parent_id: { type: GraphQLString },
    toko_id: { type: GraphQLList(GraphQLString) }
  },
  fields: {
    ...fields,
    ...commonFields
  }
}
