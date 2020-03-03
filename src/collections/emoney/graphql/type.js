const graphql = require('graphql')

const { findUser } = require('../../../utils/mongoServices')

const {
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLID
} = graphql

const PaymentType = new GraphQLEnumType({
  name: 'Payment',
  values: {
    DEBIT: { value: 'Debit' },
    CREDIT: { value: 'Credit' }
  }
})

const EmoneyType = new GraphQLObjectType({
  name: 'Emoney',
  fields: () => ({
    id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    transaction_id: { type: GraphQLID },
    bill_id: { type: GraphQLID },
    transaction_amount: { type: GraphQLInt },
    saldo: { type: GraphQLInt },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
    type: { type: PaymentType }
  })
})

const EmoneyResponseType = new GraphQLObjectType({
  name: 'EmoneyResponse',
  fields: () => ({
    user_id: { type: GraphQLString },
    success: { type: GraphQLString },
    status: { type: GraphQLID },
    error: { type: GraphQLString },
    transaction: {
      type: EmoneyType,
      resolve (parent) {
        return findUser(parent.user_id)
      }
    }
  })
})

module.exports.EmoneyType = EmoneyType
module.exports.EmoneyResponseType = EmoneyResponseType
module.exports.PaymentType = PaymentType
