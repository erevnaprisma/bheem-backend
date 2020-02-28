module.exports.word_signup_success =  "Success, please check your email";
module.exports.word_login = "Welcome to RayaPay";
module.exports.word_change_password = "Change password success";
module.exports.word_change_email = "Change email success";
module.exports.word_change_username = "Change username success";

//Error
const errorHandling = (text) => {
     throw new Error(text);
}

module.exports.errorHandling = errorHandling;