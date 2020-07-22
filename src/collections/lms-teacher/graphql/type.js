const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInt
} = graphql
const TeacherType = new GraphQLObjectType({
  name: 'Teacher',
  fields: () => ({
    _id: { type: GraphQLID },
    user_id: { type: GraphQLString },
    created_at: { type: GraphQLLong },
    updated_at: { type: GraphQLLong }
  })
})
module.exports = {
  TeacherType
}
