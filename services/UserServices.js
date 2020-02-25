const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const randomString = require('randomstring');
const nodemailer = require('nodemailer');
const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string().min(5).max(25),
    full_name: Joi.string().min(6).max(40),
    email: Joi.string().email(),
    password: Joi.string().min(5).max(15),
    device_id: Joi.string()
  });

const signup = async (email, device_id) => {
    if(!email || !device_id) return {status: 400, error: 'Email or Password can\'t be empty'}

    let user = new User({
        email,
        device_id,
        username: generateRandomString(8),
        password: generateRandomString(6)
    });

    const { error } = schema.validate({email: user.email});
        if(error) return {status: 400, error: error.details[0].message}

    try {     

        const access_token = await jwt.sign({ userID: user._id }, config.get('privateKey'), { expiresIn: "30min"});
        
        await sendMailVerification(user);

        await user.save();

        return {access_token}
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
            user_id: user._id
        };
    }
    catch(err) {
        return {status: 500, error: err}
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

const changeEmail = async (new_email, user_id) => {
    const { error } = schema.validate({ email: new_email });
    if(error) return {status: 400, error: error.details[0].message}

    try {

        await User.updateOne({_id: user_id}, { email: new_email });

        return { user_id };
    }
    catch (er) {
        return {status: 400, error: er || 'Update failed'};
    }
}

const changePassword = async (user_id, new_password) => {
    try {
        const hashed_pass = await User.hashing(new_password);
        await User.findOneAndUpdate({_id: user_id}, {password: hashed_pass});

        return { user_id };
    }
    catch (er) {
        return {status: 400, error: er || 'Update failed'}
    }
}

const changeUsername = async (user_id, new_username) => {
    const { error } = schema.validate({ username: new_username });
    if(error) return { error: 400, error: error.details[0].message }

    try{
        await User.findOneAndUpdate({ _id: user_id }, { username: new_username });

        return {user_id};
    }
    catch(er) {
        return {status: 400, error: err || 'Update failed'}
    }
}

module.exports.signup = signup;
module.exports.login = login;
module.exports.findUser = findUser;
module.exports.getAllUser = getAllUser;
module.exports.changeEmail = changeEmail;
module.exports.changePassword = changePassword;
module.exports.changeUsername = changeUsername;