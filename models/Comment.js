const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      unique: true
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    postID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  },
  {
    timestamps: true
  }
)

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment
