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
const FileType = new GraphQLObjectType({
  name: 'file',
  fields: () => ({
    _id: { type: GraphQLID },
    filename: { type: GraphQLString },
    file_type: { type: GraphQLString },
    file_size: { type: GraphQLInt },
    mtime: { type: GraphQLString },
    filenameorigin: { type: GraphQLString },
    created_by: { type: UserType },
    updated_by: { type: UserType },
    created_at: { type: GraphQLLong },
    updated_at: { type: GraphQLLong }
  })
})
module.exports = {
  FileType
}
