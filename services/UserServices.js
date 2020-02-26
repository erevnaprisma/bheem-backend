const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const randomString = require('randomstring');
const nodemailer = require('nodemailer');
const Joi = require('joi');
const { word_signup_success, word_login, word_change_email, word_change_password, word_change_username } = require('../constants/word');

const signup = async (email, device_id) => {
    if(!email || !device_id) return {status: 400, error: 'Email or Password can\'t be empty'}

    let user = new User({
        email,
        device_id,
        username: generateRandomString(8),
        password: generateRandomString(6)
    });

    const { error } = User.validation({ email, device_id });
    if(error) return { status: 400, error: error.details[0].message }

    try {     

        const access_token = await jwt.sign({ userID: user._id }, config.get('privateKey'), { expiresIn: "30min"});
        
        await sendMailVerification(user);

        user = await user.save();

        return { user_id: user._id, access_token, success: word_signup_success }
    }
    catch(err) {
        return {status: '500', error: err || 'Failed to save to data...'}
    }
}

const login = async (username, password) => {
    if(!username || !password) return {status: 400, error: 'Email or Password can\'t be empty '}

    const user = await User.findOne({ username });
    if (!user) return {status: 400, error: "Invalid name or password"}

    try {
        //verified password
        await user.comparedPassword(password);

        //generate access token
        const access_token = await jwt.sign({ userID: user._id }, config.get('privateKey'), { expiresIn: "30min"});

        return {
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

    if(!user_id) return { status:400, error: 'user id not found'}

    const { error } = User.validation({ email: new_email });
    if(error) return {status: 400, error: error.details[0].message}

    try {
        const user = await User.findById({ _id: user_id });
        
        await user.comparedPassword(password);

        await User.updateOne({_id: user_id}, { email: new_email });

        return { success: word_change_email };
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
        const user = await User.findById({ _id: user_id });

        await user.comparedPassword(password);

        const hashed_pass = await User.hashing(new_password);
        await User.findOneAndUpdate({_id: user_id}, {password: hashed_pass});

        return { success: word_change_password };
    }
    catch (er) {
        return {status: 400, error: er || 'Update failed'}
    }
}

const changeUsername = async (user_id, new_username, password) => {
    if(!new_username || !password) return { status:400, error:'Must provide username or password'}

    if(!user_id) return { status:400, error: 'user id not found'}

    const { error } = User.validation({ username: new_username });
    if(error) return { error: 400, error: error.details[0].message }

    try{
        const user = await User.findById({ _id: user_id });
        
        await user.comparedPassword(password);

        await User.findOneAndUpdate({ _id: user_id }, { username: new_username });

        return { success: word_change_username};
    }
    catch(er) {
        return {status: 400, error: err || 'Update failed'}
    }
}

const findUser = (args) => {
    return User.findById(args);
}

const generateRandomString = (length) => {
    return randomString.generate({
        length, 
    })
}

const getAllUser = () => {
    return User.find();
}

const sendMailVerification = async (model) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
          user: config.get('mongoDB.email'),
          pass: config.get('mongoDB.password')
        }
      });
      
      const mailOptions = {
        from: config.get('mongoDB.email'),
        to: model.email,
        subject: 'RayaPay',
        text: `Thank you for applying on RayaPay. We are looking forward for your action in changing your name and password.
        name: ${model.username}
        password: ${model.password}`,
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports.signup = signup;
module.exports.login = login;
module.exports.findUser = findUser;
module.exports.getAllUser = getAllUser;
module.exports.changeEmail = changeEmail;
module.exports.changePassword = changePassword;
module.exports.changeUsername = changeUsername;