const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt
} = graphql

const MerchantType = new GraphQLObjectType({
  name: 'Merchant',
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    device_id: { type: GraphQLString },
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

module.exports.MerchantType = MerchantType
module.exports.MerchantResponseType = MerchantResponseType
