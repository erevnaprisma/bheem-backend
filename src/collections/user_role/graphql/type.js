const graphql = require('graphql')
const GraphQLLong = require('graphql-type-long')
const { UserType } = require('../../user/graphql/type')
const { RoleType } = require('../../role/graphql/type')
const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInt
} = graphql
const UserRoleType = new GraphQLObjectType({
  name: 'user_role',
  fields: () => ({
    _id: { type: GraphQLID },
    user_id: { type: UserType },
    role_id: { type: GraphQLList(RoleType) },
    created_by: { type: UserType },
    updated_by: { type: UserType },
    created_at: { type: GraphQLLong },
    updated_at: { type: GraphQLLong }
  })
})
module.exports = {
  UserRoleType
}
