const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const randomString = require('randomstring');
const nodemailer = require('nodemailer');

const signup = async (args) => {
    let user = new User({
        email: args.email,
        device_id: args.device_id,
        username: generateRandomString(8),
        password: generateRandomString(6)
    });
    
    try {
        const access_token = await jwt.sign({ userID: user._id }, config.get('privateKey'), { expiresIn: "30min"});
        
        await sendMailVerification(user);

        await user.save();

        return {access_token}
    }
    catch(err) {
        return {status: '500', error: 'Failed to save user data to server'}
    }
}

const login = async (args) => {
    const user = await User.findOne({ username: args.username });
    if (!user) return {status: 400, error: "Invalid name or password"}

    try {
        //verified password
        await user.comparedPassword(args.password);

        //generate access token
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

const generateRandomString = (length) => {
    return randomString.generate({
        length, 
    })
}

const sendMailVerification = async (model) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
          user: config.get('mongoDB.email'),
          pass: config.get('mongoDB.password')
        }
      });
      
      var mailOptions = {
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