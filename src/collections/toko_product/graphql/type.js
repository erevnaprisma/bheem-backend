const graphql = require('graphql')
const Manifest = require('../manifest')
const entity = Manifest.entity

const {
  GraphQLObjectType
} = graphql

const Type = new GraphQLObjectType({
  name: Manifest.collection,
  fields: () => (Manifest.fields)
})
module.exports = {
  [entity + 'Type']: Type
}
