const { signToken } = require('../middleware/jwtUtils')
const User = require('../models/User')
const Post = require('../models/Post')
const router = require('express').Router()

router.post('/tweet', async (req, res) => {
  try {
    req.body.userID = req.user._id

    const post = await Post.create(req.body)
    return res.status(201).json({ post })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Post can not be created!' })
  }
})

module.exports = router
