const graphql = require('graphql')

const { ResponseType } = require('./type')
const { serviceTopupVa } = require('../topUpVa')

const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} = graphql

const topupVa = {
  type: ResponseType,
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLString) },
    amount: { type: new GraphQLNonNull(GraphQLInt) }
  },
  resolve (parent, args) {
    return serviceTopupVa(args)
  }
}

module.exports.topupVa = topupVa
