const {
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType
} = require('graphql')

const TransactionSettlement = new GraphQLObjectType({
  name: 'TransactionSettlement',
  fields: () => ({
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    transaction: { type: GraphQLList(GraphQLString) }
  })
})

module.exports = {
  TransactionSettlement
}