const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType
} = graphql

const ResponseType = new GraphQLObjectType({
  name: 'Response',
  fields: () => ({
    error: { type: GraphQLString },
    status: { type: GraphQLInt },
    success: { type: GraphQLString }
  })
})

const StaticPaymentScanType = new GraphQLObjectType({
  name: 'ScanResponse',
  fields: () => ({
    transaction_id: { type: GraphQLString },
    merchant_id: { type: GraphQLString },
    billing_id: { type: GraphQLString },
    error: { type: GraphQLString },
    status: { type: GraphQLInt },
    success: { type: GraphQLString }
  })
})

module.exports.ResponseType = ResponseType
module.exports.StaticPaymentScanType = StaticPaymentScanType
