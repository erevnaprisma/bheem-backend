const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');

const signup = async (args) => {
    let user = new User({
        name: args.name,
        email: args.email,
        password: args.password
    });
    
    //access token
    const access_token = await jwt.sign({ userID: user._id }, config.get('privateKey'), { expiresIn: "30min"});
    
    try {
        await user.save();
        return {access_token}
    }
    catch(err) {
        return {status: '500', error: 'Failed to save user data to server'}
    }
}

const login = async (args) => {
    const user = await User.findOne({ email: args.email });
    if (!user) return {status: 400, error: "Invalid name or password"}

    try {
        await user.comparedPassword(args.password);

        const access_token = await jwt.sign({ userID: user._id }, config.get('privateKey'), { expiresIn: "30min"});

        return {
            access_token
        };
    }
    catch(err) {
        return {status: 500, error: err}
    }
}

const findUser = (args) => {
    return User.findById(args.id);
}

module.exports.signup = signup;
module.exports.login = login;
module.exports.findUser = findUser;