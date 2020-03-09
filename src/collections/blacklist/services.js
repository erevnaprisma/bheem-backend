const Blacklist = require('./Model')
const { getUnixTime } = require('../../utils/services/supportServices')

const serviceAddBlacklist = async (token) => {
  const blacklist = await new Blacklist({
    token,
    created_at: getUnixTime(),
    updated_at: getUnixTime()
  })

  await blacklist.save()
}

module.exports.serviceAddBlacklist = serviceAddBlacklist
