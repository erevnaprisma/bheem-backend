const User = require('../../collections/user/Model')

const findUser = (args) => {
  return User.findOne({ user_id: args })
}

const reusableFindUserByID = (_id) => {
  console.log('sampe sini')
  return new Promise((resolve, reject) => {
    User.findOne({ user_id: _id })
      .then((result) => resolve(result))
      .catch(() => reject('User already exist'))
  })
}

const getAllUser = () => {
  return User.find()
}

module.exports.findUser = findUser
module.exports.reusableFindUserByID = reusableFindUserByID
module.exports.getAllUser = getAllUser
