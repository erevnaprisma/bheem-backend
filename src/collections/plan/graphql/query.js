const graphql = require('graphql')

// Type
const {
  GetAllPlanType
} = require('./type')

// Services
const {
  getAllPlanService
} = require('../services')

const getAllPlan = {
  type: GetAllPlanType,
  resolve (parent, args) {
    return getAllPlanService()
  }
}

module.exports = {
  getAllPlan
}
