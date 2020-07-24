const Blacklist = require('./Model')

const serviceAddBlacklist = async (token) => {
  const blacklist = await new Blacklist({
    token,
    createdAt: new Date().getTime(),
    updated_at: new Date().getTime()
  })

  await blacklist.save()
}

const checkerBlacklist = async (token) => {
  const res = await Blacklist.findOne({ token })
  if (res) throw new Error('Token is not valid anymore')
}

module.exports = {
  serviceAddBlacklist,
  checkerBlacklist
}
