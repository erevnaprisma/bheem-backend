const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { UserType } = require('../../user/graphql/type')
const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInt
} = graphql
const RoleprivilegeType = new GraphQLObjectType({
  name: 'role_privilege',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    name: { type: GraphQLString },
    status: { type: GraphQLString },
    created_by: { type: UserType },
    updated_by: { type: UserType },
    created_at: { type: GraphQLLong },
    updated_at: { type: GraphQLLong }
  })
})
module.exports = {
  RoleprivilegeType
}
