module.exports = (req, res, next) => {
  res.header({ 'Access-Control-Expose-Headers': '*, Authorization' })

  next()
}
