const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { UserType } = require('../../user/graphql/type')
const { RoleprivilegeType } = require('../../role_privilege/graphql/type')
const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInt
} = graphql
const RoleType = new GraphQLObjectType({
  name: 'role',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    role_privilege_id: { type: GraphQLList(RoleprivilegeType) },
    status: { type: GraphQLString },
    created_by: { type: UserType },
    updated_by: { type: UserType },
    created_at: { type: GraphQLLong },
    updated_at: { type: GraphQLLong }
  })
})
module.exports = {
  RoleType
}
