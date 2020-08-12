const graphql = require('graphql')
const Manifest = require('../manifest')
const Type = require('./type')
const Services = require('../services')

const {
  GraphQLBoolean,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType
} = graphql

const createData = {
  type: new GraphQLObjectType({
    name: 'create' + Manifest.entity + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: Type[Manifest.entity + 'Type'] }
    })
  }),
  args: Manifest.createArgs,
  async resolve (parent, args, context) {
    return Services['doCreate' + Manifest.entity](args, context)
  }
}
const updateData = {
  type: new GraphQLObjectType({
    name: 'update' + Manifest.entity + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      detail_data: { type: Type[Manifest.entity + 'Type'] }
    })
  }),
  args: Manifest.updateArgs,
  async resolve (parent, args, context) {
    return Services['doUpdate' + Manifest.entity](args, context)
  }
}
const deleteData = {
  type: new GraphQLObjectType({
    name: 'delete' + Manifest.entity + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString }
    })
  }),
  args: {
    _id: { type: GraphQLID }
  },
  async resolve (parent, args, context) {
    return Services['doDelete' + Manifest.entity](args, context)
  }
}

module.exports = {
  ['create' + Manifest.entity]: createData,
  ['update' + Manifest.entity]: updateData,
  ['delete' + Manifest.entity]: deleteData
}
