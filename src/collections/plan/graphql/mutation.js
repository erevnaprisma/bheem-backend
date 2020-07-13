const graphql = require('graphql')

// Type
const {
  CreatePlanType,
  DeletePlanType,
  GetAllPlanType,
  GetSelectedPlanType
} = require('./type')

// Services
const {
  createPlanService,
  deletePlanService,
  getAllPlanService,
  getSelectedPlanService
} = require('../services')

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt
} = graphql

const createPlan = {
  type: CreatePlanType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    minutes: { type: new GraphQLNonNull(GraphQLString) },
    participants: { type: new GraphQLNonNull(GraphQLInt) }
  },
  resolve (parent, args) {
    return createPlanService(args.name, args.participants, args.minutes)
  }
}

const deletePlan = {
  type: DeletePlanType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return deletePlanService(args.name)
  }
}

const getSelectedPlan = {
  type: GetSelectedPlanType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return getSelectedPlanService(args.name)
  }
}

module.exports = {
  createPlan,
  deletePlan,
  getSelectedPlan
}
