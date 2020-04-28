const CryptoJs = require('crypto-js')
const config = require('config')

module.exports = function () {
  return function (req, res, next) {
    const { hmac } = req.headers

    const signature = CryptoJs.HmacSHA256(req.body, config.get('hmac')).toString()

    if (signature !== hmac) {
      throw new Error('Invalid Hmac')
    }

    next()
  }
}
