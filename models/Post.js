const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    post: {
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
    ]
  },
  {
    timestamps: true
  }
)

const Post = mongoose.model('Post', postSchema)
module.exports = Post
