const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const Type = require('./type')
const Manifest = require('../manifest')
const Services = require('../services')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} = graphql

// const EntityType = Type[entity + 'Type']

const getAllData = {
  type: new GraphQLObjectType({
    name: 'getAll' + Manifest.entity + 's' + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(Type[Manifest.entity + 'Type']) },
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
    return Services['fetchAll' + Manifest.entity + 's'](args, context)
  }
}
const getDetailData = {
  type: new GraphQLObjectType({
    name: 'getDetail' + Manifest.entity + 'Response',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      data_detail: { type: Type[Manifest.entity + 'Type'] }
    })
  }),
  args: {
    id: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return Services['fetchDetail' + Manifest.entity](args, context)
  }
}

// no need login
const getAllDataByTokoId = {
  type: new GraphQLObjectType({
    name: 'getAll' + Manifest.entity + 's' + 'ByTokoIdResponse',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(Type[Manifest.entity + 'Type']) },
      count: { type: GraphQLLong },
      page_count: { type: GraphQLLong }
    })
  }),
  args: {
    toko_id: { type: GraphQLString },
    page_size: { type: GraphQLInt },
    page_index: { type: GraphQLInt },
    string_to_search: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return Services.getAllDataByTokoId(args, context)
  }
}
const getAllDataByCategoryId = {
  type: new GraphQLObjectType({
    name: 'getAll' + Manifest.entity + 's' + 'ByCategoryIdResponse',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      list_data: { type: GraphQLList(Type[Manifest.entity + 'Type']) },
      count: { type: GraphQLLong },
      page_count: { type: GraphQLLong }
    })
  }),
  args: {
    category_id: { type: GraphQLString },
    page_size: { type: GraphQLInt },
    page_index: { type: GraphQLInt },
    string_to_search: { type: GraphQLString }
  },
  async resolve (parent, args, context) {
    return Services.getAllDataByCategoryId(args, context)
  }
}

module.exports = {
  ['getAll' + Manifest.entity + 's']: getAllData,
  ['getDetail' + Manifest.entity]: getDetailData,
  ['getAll' + Manifest.entity + 's' + 'ByTokoId']: getAllDataByTokoId,
  ['getAll' + Manifest.entity + 's' + 'ByCategoryId']: getAllDataByCategoryId
}
