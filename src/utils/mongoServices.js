const User = require('../collections/user/Model');

const findUser = (args) => {
    return User.findById(args);
}

const reusableFindUserByID =  (_id) => {
    return new Promise((resolve, reject) => {
        const user = User.findOne({ _id })
            .then((result) => resolve(result))
            .catch(() => reject('User already exist'));
    })
}

const getAllUser = () => {
    return User.find();
}

module.exports.findUser = findUser;
module.exports.reusableFindUserByID = reusableFindUserByID;
module.exports.getAllUser = getAllUser;