const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLObjectType
} = graphql

const CreateMeetingType = new GraphQLObjectType({
  name: 'CreateMeeting',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    title: { type: GraphQLString },
    host: { type: GraphQLString },
    createdBy: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
})

module.exports = {
  CreateMeetingType
}
