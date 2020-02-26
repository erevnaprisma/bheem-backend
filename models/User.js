const mongoose = require('mongoose');
require('mongoose-type-email');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      min: 5,
      max: 25,
      unique: true
    },
    full_name: {
      type: String, 
      min: 6,
      max: 40,
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      unique: true
    },
    password: {
      type: String,
      min: 5,
      max: 15
    },
    device_id: {
      type: String, 
      min: 2
    },
    first_name: {
      type: String,
      min:3,
      max: 14
    },
    last_name: {
      type: String,
      min: 3,
      max: 14
    },
    nickname: {
      type: String,
      min: 3,
      max: 10
    },
    address: {
      type: String, 
      min: 6,
      max: 35
    }   
});

userSchema.pre('save', function(next){
    const user = this;
    
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return next(err);
        }
    
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) {
            return next(err);
          }
          user.password = hash;
          next();
        });
      });
});

userSchema.statics.validation = (args) => {
  const schema = Joi.object({
    username: Joi.string().min(5).max(25),
    full_name: Joi.string().min(6).max(40),
    email: Joi.string().email(),
    password: Joi.string().min(5).max(15),
    device_id: Joi.string().min(2),
    first_name: Joi.string().min(3).max(14),
    last_name: Joi.string().min(3).max(14),
    nickname: Joi.string().min(3).max(14),
    address: Joi.string().min(6).max(35)
  });

  return schema.validate(args);
}

userSchema.statics.hashing = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if(err) return reject(err)

      bcrypt.hash(password, salt, (err, hash) => {
        if(err) return reject(err)

        resolve(hash);
      })
    })
  })
}

userSchema.methods.comparedPassword = function(candidatePassword) {
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
          if (err) {
            return reject(err);
          }
    
          if (!isMatch) {
            return reject('Invalid password');
          }
    
          resolve(true);
        });
      });
}

module.exports = mongoose.model('User', userSchema);