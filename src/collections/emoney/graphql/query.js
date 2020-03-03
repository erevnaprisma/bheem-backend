const graphql = require('graphql')
const Emoney = require('../Model')

const { EmoneyResponseType } = require('./type')

const allTransaction = {
  type: EmoneyResponseType,
  async resolve (parent, args, context) {
    console.log('sampai sini')
  }
}

module.exports.allTransaction = allTransaction
