const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} = graphql

const PlanType = new GraphQLObjectType({
  name: 'Plan',
  fields: () => ({
    name: { type: GraphQLString },
    minutes: { type: GraphQLString },
    participants: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
})

const CreatePlanType = new GraphQLObjectType({
  name: 'CreatePlan',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const DeletePlanType = new GraphQLObjectType({
  name: 'DeletePlan',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const GetAllPlanType = new GraphQLObjectType({
  name: 'GetAllPlan',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    plans: { type: GraphQLList(PlanType) }
  })
})

const GetSelectedPlanType = new GraphQLObjectType({
  name: 'GetSelectedPlan',
  fields: () => ({
    status: { type: GraphQLString },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
    plan: { type: PlanType }
  })
})

module.exports = {
  CreatePlanType,
  DeletePlanType,
  GetAllPlanType,
  GetSelectedPlanType
}
