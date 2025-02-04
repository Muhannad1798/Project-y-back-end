const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema(
  {
    firstUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    secondUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

const Conversation = mongoose.model('Conversation', conversationSchema)
module.exports = Conversation
