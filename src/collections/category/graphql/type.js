const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const Manifest = require('../manifest')
const { UserType } = require('../../user/graphql/type')
const { TokoTokoOnlineType } = require('../../toko_toko_online/graphql/type')
const entity = Manifest.entity

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList
} = graphql

const Type = new GraphQLObjectType({
  name: Manifest.collection,
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    parent_id: { type: Type },
    toko_id: { type: GraphQLList(TokoTokoOnlineType) },
    created_by: { type: UserType },
    updated_by: { type: UserType },
    created_at: { type: GraphQLLong },
    updated_at: { type: GraphQLLong }
  })
})
module.exports = {
  [entity + 'Type']: Type
}
