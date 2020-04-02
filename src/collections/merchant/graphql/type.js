const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql

const MerchantType = new GraphQLObjectType({
  name: 'Merchant',
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    device_id: { type: GraphQLString },
    address: { type: GraphQLString }
  })
})

const MerchantResponseType = new GraphQLObjectType({
  name: 'MerchantResponse',
  fields: () => ({
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    access_token: { type: GraphQLString }
  })
})

const AllMerchantResponseType = new GraphQLObjectType({
  name: 'AllMerchantResponse',
  fields: () => ({
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    merchant: { type: GraphQLList(MerchantType) }
  })
})

module.exports.MerchantType = MerchantType
module.exports.MerchantResponseType = MerchantResponseType
module.exports.AllMerchantResponseType = AllMerchantResponseType
