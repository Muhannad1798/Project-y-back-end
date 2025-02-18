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
    return res.status(500).json({ error: 'comment can not be created!' })
  }
})

router.get('/:post_id/com', async (req, res) => {
  try {
    const post_id = req.params.post_id
    const comments = await Comment.find({ postID: post_id })
      .populate('postID')
      .populate('userID')
    return res.status(200).json({ comments })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'comment data cannot be retrieved!' })
  }
})
router.get('/myComment', async (req, res) => {
  try {
    const comment = await Comment.find({ userID: req.user._id })
    return res.status(200).json({ comment })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'comments data cannot be retrieved!' })
  }
})

router.post('/:commentId/like', async (req, res) => {
  try {
    const post_id = req.params.commentId
    const comment = await Comment.findByIdAndUpdate(post_id, {
      $push: { likes: req.user._id }
    })
    return res.status(200).json({ comment })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: 'something went wrong, try again later' })
  }
})

router.post('/:commentId/dislike', async (req, res) => {
  try {
    const post_id = req.params.commentId
    const comment = await Comment.findByIdAndUpdate(post_id, {
      $pull: { likes: req.user._id }
    })
    return res.status(200).json({ comment })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: 'something went wrong, try again later' })
  }
})

router.get('/:commentId/like', async (req, res) => {
  try {
    const post_id = req.params.commentId
    const comment = await Comment.find({}).populate('likes')
    const like = comment[0].likes.length
    return res.status(200).json({ like })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'likes data cannot be retrieved!' })
  }
})

module.exports = router
