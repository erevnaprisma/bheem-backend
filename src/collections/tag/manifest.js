const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { FileType } = require('../file/graphql/type')
const { UserType } = require('../user/graphql/type')
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

const fields = {
  _id: { type: GraphQLID },
  name: { type: GraphQLString }
}
module.exports = {
  entity: 'Tag',
  collection: 'tag',
  updateArgs: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString }
  },
  createArgs: {
    name: { type: GraphQLString }
  },
  fields: {
    ...fields,
    ...commonFields
  }
}
