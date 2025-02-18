const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      default: ' this is my bio'
    },
    pic: {
      type: String,
      default:
        'https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg'
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    followingN: { type: Number, default: 0 },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    followersN: { type: Number, default: 0 },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    postN: { type: Number, default: 0 },
    conversation: [
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

userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    delete returnedObj.password
    delete returnedObj.__v
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User
