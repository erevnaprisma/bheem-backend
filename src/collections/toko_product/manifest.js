const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { FileType } = require('../file/graphql/type')
const { CategoryType } = require('../category/graphql/type')
const { TokoTokoOnlineType } = require('../toko_toko_online/graphql/type')
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
  code: { type: GraphQLString },
  price: { type: GraphQLInt },
  description: { type: GraphQLString },
  image_id: { type: FileType },
  category_id: { type: GraphQLList(CategoryType) },
  toko_id: { type: GraphQLList(TokoTokoOnlineType) },
  status: { type: GraphQLString }
}
module.exports = {
  entity: 'TokoProduct',
  collection: 'toko_product',
  updateArgs: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    code: { type: GraphQLString },
    price: { type: GraphQLString },
    description: { type: GraphQLString },
    image_id: { type: GraphQLString },
    toko_id: { type: GraphQLList(GraphQLString) },
    category_id: { type: GraphQLList(GraphQLString) },
    status: { type: GraphQLString }
  },
  createArgs: {
    name: { type: GraphQLString },
    code: { type: GraphQLString },
    price: { type: GraphQLString },
    description: { type: GraphQLString },
    category_id: { type: GraphQLList(GraphQLString) },
    toko_id: { type: GraphQLList(GraphQLString) },
    image_id: { type: GraphQLString },
    status: { type: GraphQLString }
  },
  fields: {
    ...fields,
    ...commonFields
  }
}
