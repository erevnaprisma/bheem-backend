const graphql = require('graphql');

const { signUp, changeUserEmail, changeUserPassword, changeUserName, changeUserProfile } = require('./src/collections/user/graphql/mutation');
const { login, getProfile, allUser } = require('./src/collections/user/graphql/query');
const { addDummy } = require('./src/collections/emoney/graphql/mutation');

const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLInt,
    buildSchema
} = graphql;

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        login,
        getProfile,
        allUser
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:  {
        signUp,
        changeUserEmail,
        changeUserName,
        changeUserPassword,
        changeUserProfile,
        addDummy
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});





