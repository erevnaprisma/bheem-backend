const mongoose = require('mongoose')

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true
  },
  createdAt: {
    type: String
  },
  updatedAt: {
    type: String
  }
})

module.exports = mongoose.model('Blacklist', blacklistSchema)
