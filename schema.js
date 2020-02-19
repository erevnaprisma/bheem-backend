const graphql = require('graphql');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        login: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const user = await User.findOne({ name: args.name });
                if (!user) return {status: 400, err: "name or password not correct"}

                const res = await bcrypt.compare(args.password, user.password);
                if(!res) return {status: 400, err: "name or password not correct"}

                //access token
                const access_token = await jwt.sign({ userID: user._id }, config.get('privateKey'), { expiresIn: "15min"});

                return user;
            }
        },
        allUser: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find();
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:  {
        signUp: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                email: { type: new GraphQLNonNull(GraphQLString)},
                password: { type: new GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent, args, context) {
                let user = new User({
                    name: args.name,
                    email: args.email,
                    password: args.password
                });
                
                //hash password
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);

                //refresh token
                const refresh_token = await jwt.sign({ userID: user._id}, config.get('privateKey'), { expiresIn: "7d"});

                //access token
                const access_token = await jwt.sign({ userID: user._id }, config.get('privateKey'), { expiresIn: "15min"});

                context.headers.access_token = access_token;

                
                return user.save();
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
