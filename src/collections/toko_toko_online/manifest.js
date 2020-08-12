const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { FileType } = require('../file/graphql/type')
const { CategoryType } = require('../category/graphql/type')
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
  name: { type: GraphQLString },
  description: { type: GraphQLString },
  website: { type: GraphQLString },
  facebook: { type: GraphQLString },
  instagram: { type: GraphQLString },
  youtube: { type: GraphQLString },
  status: { type: GraphQLString }
}
module.exports = {
  entity: 'TokoTokoOnline',
  collection: 'toko_toko_online',
  updateArgs: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    website: { type: GraphQLString },
    facebook: { type: GraphQLString },
    instagram: { type: GraphQLString },
    youtube: { type: GraphQLString },
    status: { type: GraphQLString }
  },
  createArgs: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    website: { type: GraphQLString },
    facebook: { type: GraphQLString },
    instagram: { type: GraphQLString },
    youtube: { type: GraphQLString },
    status: { type: GraphQLString }
  },
  fields: {
    ...fields,
    ...commonFields
  }
}
