const User = require('./Model');
const jwt = require('jsonwebtoken');
const config = require('config');

const { findUser, getAllUser, reusableFindUserByID } = require('../../utils/mongoServices');
const { generateRandomString, sendMailVerification } = require('../../utils/supportServices');
const { word_signup_success, word_login, word_change_email, word_change_password, word_change_username, errorHandling } = require('../../../constants/word');

const userSignup = async (email, device_id) => {
    if(!email || !device_id) return {status: 400, error: 'Email or Password can\'t be empty'}

    const emailCheck = await User.findOne({email});
    console.log(emailCheck)
    if(emailCheck) return { status:400, error:'Email already used' }

    let user = new User({
        email,
        device_id,
        username: generateRandomString(8),
        password: generateRandomString(6)
    });

    const local_password = user.password;

    const { error } = User.validation({ email, device_id });
    if(error) return { status: 400, error: error.details[0].message }

    try {     

        const access_token = await jwt.sign({ userID: user._id }, config.get('privateKey'), { expiresIn: "30min"});
        
        user = await user.save();

        user.password = local_password;

        await sendMailVerification(user);

        return { status: 200, user_id: user._id, access_token, success: word_signup_success }
    }
    catch(err) {
        return {status: '500', error: err || 'Failed to save to data...'}
    }
}

const userLogin = async (username, password) => {
    if(!username || !password) return {status: 400, error: 'Email or Password can\'t be empty'}

    const user = await User.findOne({ username });
    // console.log(user);
    if (!user) return {status: 400, error: 'Invalid email or password'}

    try {
        //verified password
        await user.comparedPassword(password);

        //generate access token
        const access_token = await jwt.sign({ userID: user._id }, config.get('privateKey'), { expiresIn: "30min"});

        return {
            status: 200,
            access_token,
            user_id: user._id,
            success: word_login
        };
    }
    catch(err) {
        return {status: 500, error: err}
    }
}

const changeEmail = async (new_email, user_id, password) => {
    if(!new_email || !password) return { status:400, error: 'Must provide email or password' }

    if(!user_id) return { status:400, error: 'User ID not found'}

    const emailChecker = await User.findOne({ email: new_email });
    if(emailChecker) return { status: 400, error: 'Email already used'}

    const { error } = User.validation({ email: new_email });
    if(error) return {status: 400, error: error.details[0].message}

    try {     
        const user = await reusableFindUserByID(user_id);
        
        await user.comparedPassword(password);

        await User.updateOne({_id: user_id}, { email: new_email }).catch(() => { errorHandling('Failed updating user') });

        return { status: 200, success: word_change_email };
    }
    catch (err) {
        return {status: 400, error: err || 'Update failed'};
    }
}

const changePassword = async (user_id, new_password, password) => {
    if(!new_password || !password) return { status: 400, error: 'Must provide new password or old password'}

    if(!user_id) return { status:400, error: 'user id not found'}

    const { error } = User.validation({ password: new_password});
    if(error) return { status: 400, error: error.details[0].message }
    
    try {
        const user = await reusableFindUserByID(user_id);

        await user.comparedPassword(password);

        const hashed_pass = await User.hashing(new_password);
        await User.findOneAndUpdate({ _id: user_id }, { password: hashed_pass }).catch(() => { errorHandling('Failed updating password') });

        return { status: 200, success: word_change_password };
    }
    catch (err) {
        return {status: 400, error: err || 'Update failed'}
    }
}

const changeName = async (user_id, new_username, password) => {
    if(!new_username || !password) return { status:400, error:'Must provide username or password'}

    if(!user_id) return { status:400, error: 'User id not found'}

    const usernameChecker = await User.findOne({ username: new_username })
    if(usernameChecker) return { status: 400, error:'Username already used'}

    const { error } = User.validation({ username: new_username });
    if(error) return { error: 400, error: error.details[0].message }

    try{
        const user = await reusableFindUserByID(user_id);

        await user.comparedPassword(password);

        await User.findOneAndUpdate({ _id: user_id }, { username: new_username }).catch(() => { errorHandling('Failed updating username') });

        return { status: 200, success: word_change_username};
    }
    catch(err) {
        return {status: 400, error: err || 'Update failed'}
    }
}

const changeProfile = async args => {
    if(!args.user_id) return { status: 400, error: 'User ID not found'}

    if(!args.password) return { status: 400, error: 'Must provide password'}

    try {
        await User.where({ _id: args.user_id }).update({ $set: { first_name: args.first_name, last_name: args.last_name, nickname: args.nickname, full_name: args.full_name, address: args.address }}).catch(() => { errorHandling('Failed updating user profile') });

        const user = await reusableFindUserByID(args.user_id);

        await user.comparedPassword(args.password);

        return { status: 200, success: 'Update profile success'}
    }
    catch(err){
        return { status: 400, error: err || 'Cannot update profile' }
    }
}

const getUserProfile = async (args) => {
    if(!args) return { status: 400, error: 'Must provide user'}

    await reusableFindUserByID(args);

    try {
        return { user_id: args, success: 'Success', status: 200 }
    }
    catch(err) {
        return { status: 400, error: 'User not found'}
    }
}

module.exports.userSignup = userSignup;
module.exports.userLogin = userLogin;
module.exports.changeEmail = changeEmail;
module.exports.changePassword = changePassword;
module.exports.changeName = changeName;
module.exports.changeProfile = changeProfile;
module.exports.getUserProfile = getUserProfile;