const { signToken } = require('../middleware/jwtUtils')
const User = require('../models/User')
const Comment = require('../models/Comment')
const Post = require('../models/Post')

const router = require('express').Router()

router.post('/:post_id/rep', async (req, res) => {
  try {
    req.body.userID = req.user._id
    req.body.postID = req.params.post_id
    const comment = await Comment.create(req.body)
    return res.status(201).json({ comment })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Post can not be created!' })
  }
})

module.exports = router
