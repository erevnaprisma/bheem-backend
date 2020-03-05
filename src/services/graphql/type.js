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

module.exports.ResponseType = ResponseType
