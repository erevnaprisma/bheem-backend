module.exports.WORD_SIGN_UP = 'Success, please check your email'
module.exports.WORD_LOGIN = 'Welcome to RayaPay'
module.exports.WORD_CHANGE_PASSWORD = 'Change password success'
module.exports.WORD_CHANGE_EMAIL = 'Change email success'
module.exports.WORD_CHANGE_USERNAME = 'Change username success'
module.exports.FALSY = [NaN, null, false, '', undefined];

// Error
const errorHandling = (text) => {
  throw new Error(text)
}

module.exports.errorHandling = errorHandling
