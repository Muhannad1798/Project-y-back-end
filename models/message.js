const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
  {
    convID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation'
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
)

const Message = mongoose.model('Message', messageSchema)
module.exports = Message
