const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt
} = graphql

const BheemUserType = new GraphQLObjectType({
  name: 'BheemUser',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    fullName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    deviceId: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    nickname: { type: GraphQLString },
    address: { type: GraphQLString },
    profilePicture: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
})

const BheemLoginType = new GraphQLObjectType({
  name: 'BheemLogin',
  fields: () => ({
    user: { type: BheemUserType },
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const BheemSignUpType = new GraphQLObjectType({
  name: 'BheemSignUp',
  fields: () => ({
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const BheemLogoutType = new GraphQLObjectType({
  name: 'BheemLogout',
  fields: () => ({
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const BheemChangePasswordType = new GraphQLObjectType({
  name: 'BheemChangePassword',
  fields: () => ({
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

module.exports = {
  BheemSignUpType,
  BheemLoginType,
  BheemLogoutType,
  BheemUserType,
  BheemChangePasswordType
}
