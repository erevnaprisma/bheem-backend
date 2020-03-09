const mongoose = require('mongoose')

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true
  },
  created_at: {
    type: String
  },
  updated_at: {
    type: String
  }
})

module.exports = mongoose.model('Blacklist', blacklistSchema)
