const graphql = require('graphql');

const { signup, login, findUser } = require('./services/UserServices');

const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLInt,
    List
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    })
});

const LoginType = new GraphQLObjectType({
    name: 'Login',
    fields: () => ({
        access_token: { type: GraphQLString },
        status: { type: GraphQLInt},
        error: { type: GraphQLString},
        user: { 
            type: UserType, 
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return findUser(args);
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        login: {
            type: LoginType,
            args: {
                name: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args, context) {
                return login(args);
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:  {
        signUp: {
            type: LoginType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                email: { type: new GraphQLNonNull(GraphQLString)},
                password: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, context) {
                return signup(args);
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
