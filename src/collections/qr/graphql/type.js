const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} = graphql

const QrResponseType = new GraphQLObjectType({
  name: 'QrResponse',
  fields: () => ({
    success: { type: GraphQLString },
    status: { type: GraphQLID },
    error: { type: GraphQLString }
  })
})

module.exports.QrResponseType = QrResponseType
