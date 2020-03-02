const graphql = require('graphql');

const { EmoneyResponseType } = require('./type');

const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLList,
    GraphQLEnumType,
    GraphQLID,    
    GraphQLBoolean
} = graphql;

const allTransaction = {
    type: EmoneyResponseType,
    async resolve(parent, args, context) {
        return;
    }
}