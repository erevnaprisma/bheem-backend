const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLObjectType
} = graphql

const AnonymousRequestToJoinType = new GraphQLObjectType({
  name: 'AnonymousRequestToJoin',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

module.exports = {
  AnonymousRequestToJoinType
}
