const graphql = require('graphql');

const { userSignup, changeEmail, changePassword, changeName, changeProfile } = require('../services');
const { AuthType } = require('./type');

const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
} = graphql;

const signUp = {
    type: AuthType,
    args: {
        email: { type: new GraphQLNonNull(GraphQLString)},
        device_id: { type: new GraphQLNonNull(GraphQLString)}
    },
    resolve(parent, args) {
        return userSignup(args.email, args.device_id)
    }
}

const changeUserEmail = {
    type: AuthType,
    args: {
        user_id: { type: new GraphQLNonNull(GraphQLString)},
        new_email: { type: new GraphQLNonNull(GraphQLString)},
        password: { type: new GraphQLNonNull(GraphQLString)}
    },
    resolve(parent, args) {
        return changeEmail( args.new_email, args.user_id, args.password);
    }
}

const changeUserPassword = {
    type: AuthType,
    args: {
        user_id: { type: new GraphQLNonNull(GraphQLID)},
        new_password: { type: new GraphQLNonNull(GraphQLString)},
        password: { type: new GraphQLNonNull(GraphQLString)}
    },
    resolve(parent, args) {
        return changePassword(args.user_id, args.new_password, args.password);
    }
}

const changeUserName = {
    type: AuthType,
    args: {
        user_id: { type: new GraphQLNonNull(GraphQLID)},
        new_username: { type: new GraphQLNonNull(GraphQLString)},
        password: { type: new GraphQLNonNull(GraphQLString)}
    },
    resolve(parent, args) {
        return changeName(args.user_id, args.new_username, args.password);
    }
}

const changeUserProfile = {
    type: AuthType,
            args: {
                user_id: { type: GraphQLID },
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                nickname: { type: GraphQLString },
                full_name: { type: GraphQLString },
                address: { type: GraphQLString},
                password: { type: GraphQLString, }
            },
            resolve(parent, args) {
                return changeProfile(args);
            }
}

module.exports.signUp = signUp;
module.exports.changeUserEmail = changeUserEmail;
module.exports.changeUserPassword = changeUserPassword;
module.exports.changeUserName = changeUserName;
module.exports.changeUserProfile = changeUserProfile;

