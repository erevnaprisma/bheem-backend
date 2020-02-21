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
        full_name: { type: GraphQLString },
        username: { type: GraphQLString },
        device_id: { type: GraphQLString},
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    })
});

const AuthType = new GraphQLObjectType({
    name: 'Auth',
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
            type: AuthType,
            args: {
                email: { type: GraphQLString },
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
            type: AuthType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString)},
                device_id: { type: new GraphQLNonNull(GraphQLString)}
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
