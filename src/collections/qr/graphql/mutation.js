const graphql = require('graphql')

const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString
} = graphql

const { createQrStaticService, testingService } = require('../services')
const { QrResponseType } = require('./type')

const createQrStatic = {
  type: QrResponseType,
  args: {
    merchant_id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve (parent, args) {
    return createQrStaticService(args.merchant_id)
  }
}

const testing = {
  type: QrResponseType,
  args: {
    content: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args, context) {
    return testingService(args.content, context)
  }
}

module.exports.createQrStatic = createQrStatic
module.exports.testing = testing
