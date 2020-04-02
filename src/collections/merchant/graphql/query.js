const graphql = require('graphql')

const { AllMerchantResponseType } = require('./type')
const { getAllMerchantService } = require('../services')

const AllMerchant = {
  type: AllMerchantResponseType,
  resolve (parent, args) {
    return getAllMerchantService()
  }
}

module.exports.AllMerchant = AllMerchant
