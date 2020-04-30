const CryptoJs = require('crypto-js')
const config = require('config')

module.exports = function () {
  return function (req, res, next) {
    const { hmac } = req.headers
    console.log('hmac', hmac)
    console.log('environment variable hmac', config.get('hmac'))
    console.log('body stream', req.body)

    const signature = CryptoJs.HmacSHA256(req.body, config.get('hmac')).toString()

    if (signature !== hmac) {
      res.send({ error: 'Invalid Hmac', status: 400 })
      return
    }

    next()
  }
}
