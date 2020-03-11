const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLID
} = graphql

const OtpResponseType = new GraphQLObjectType({
  name: 'OtpResponseType',
  fields: () => ({
    success: { type: GraphQLString },
    status: { type: GraphQLID },
    error: { type: GraphQLString }
  })
})

module.exports.OtpResponseType = OtpResponseType
