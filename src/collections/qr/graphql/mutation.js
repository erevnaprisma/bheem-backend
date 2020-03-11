const graphql = require('graphql')

const {
  GraphQLNonNull,
  GraphQLID
} = graphql

const { createQrStaticService } = require('../services')
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

module.exports.createQrStatic = createQrStatic
