const graphql = require('graphql');

const { signup, login, findUser, getAllUser, changeEmail, changePassword, changeUsername } = require('./services/UserServices');

const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLInt,
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
        user_id: { type: GraphQLID },
        access_token: { type: GraphQLString },
        status: { type: GraphQLInt},
        error: { type: GraphQLString},
        success: { type: GraphQLString },
        user: { 
            type: UserType, 
            resolve(parent, args) {
                return findUser(parent.user_id || args.user_id);
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
                username: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args, context) {
                return login(args.username, args.password);
            }
        },
        allUser: {
            type: new GraphQLList(UserType),
            args: {
                email: { type: GraphQLString }
            },
            resolve(parent, args) {
                return getAllUser();
            }
        }
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
                return signup(args.email, args.device_id);
            }
        },
        changeEmail: {
            type: AuthType,
            args: {
                user_id: { type: new GraphQLNonNull(GraphQLString)},
                new_email: { type: new GraphQLNonNull(GraphQLString)},
                password: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                return changeEmail( args.new_email, args.user_id, args.password);
            }
        },
        changePassword: {
            type: AuthType,
            args: {
                user_id: { type: new GraphQLNonNull(GraphQLID)},
                new_password: { type: new GraphQLNonNull(GraphQLString)},
                password: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                return changePassword(args.user_id, args.new_password, args.password);
            }
        },
        changeUsername: {
            type: AuthType,
            args: {
                user_id: { type: new GraphQLNonNull(GraphQLID)},
                new_username: { type: new GraphQLNonNull(GraphQLString)},
                password: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                return changeUsername(args.user_id, args.new_username, args.password);
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
