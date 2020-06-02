const graphql = require('graphql')

const {
  GraphQLString,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt
} = graphql

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    userId: { type: GraphQLString },
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

const LoginType = new GraphQLObjectType({
  name: 'Login',
  fields: () => ({
    token: { type: GraphQLString },
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
    success: { type: GraphQLString },
  })
})

const SignInType = new GraphQLObjectType({
  name: 'SignIn',
  fields: () => ({
    token: { type: GraphQLString },
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
    success: { type: GraphQLString }
  })
})

const LogoutType = new GraphQLObjectType({
    name: 'Logout',
    fields: () => ({
      status: { type: GraphQLInt },
      error: { type: GraphQLString },
      success: { type: GraphQLString }
    })
  })

module.exports = {
  SignInType,
  LoginType,
  LogoutType,
  UserType
}
