const mongoose = require('mongoose')

const bheemBlacklistSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Bheem_Blacklist', bheemBlacklistSchema)
