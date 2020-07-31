const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { UserType } = require('../../user/graphql/type')
const { RoleType } = require('../../role/graphql/type')
const { PrivilegeType } = require('../../privilege/graphql/type')
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
    role_id: { type: RoleType },
    privilege_id: { type: PrivilegeType },
    created_by: { type: UserType },
    updated_by: { type: UserType },
    created_at: { type: GraphQLLong },
    updated_at: { type: GraphQLLong }
  })
})
module.exports = {
  RoleprivilegeType
}
