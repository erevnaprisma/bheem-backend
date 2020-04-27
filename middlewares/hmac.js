const CryptoJs = require('crypto-js')

module.exports = function () {
  return function (req, res, next) {
    const { hmac } = req.headers

    const signature = CryptoJs.HmacSHA256(req.body, 'rayapay123#4556*').toString()

    if (signature !== hmac) {
      throw new Error('Invalid Hmac')
    }

    next()
  }
}
