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

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({})
    return res.status(200).json({ posts })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Posts data cannot be retrieved!' })
  }
})

router.get('/myPost', async (req, res) => {
  try {
    const posts = await Post.find({ userID: req.user._id })
    return res.status(200).json({ posts })
    console.log(posts)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Posts data cannot be retrieved!' })
  }
})

router.post('/:postId/like', async (req, res) => {
  try {
    const post_id = req.params.postId
    const comment = await Post.findByIdAndUpdate(post_id, {
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

router.post('/:postId/dislike', async (req, res) => {
  try {
    const post_id = req.params.postId
    const comment = await Post.findByIdAndUpdate(post_id, {
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

router.get('/:postId/like', async (req, res) => {
  try {
    const post_id = req.params.postId
    const comment = await Post.find({}).populate('likes')
    console.log(comment[0].likes)
    const like = comment[0].likes.length
    return res.status(200).json({ like })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'likes data cannot be retrieved!' })
  }
})
module.exports = router
