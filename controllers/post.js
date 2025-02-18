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

router.get('/post', async (req, res) => {
  try {
    const posts = await Post.find({}).populate('userID').sort({ createdAt: 1 })

    return res.status(200).json({ posts })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Posts data cannot be retrieved!' })
  }
})

router.get('/:postId/onePost', async (req, res) => {
  try {
    const post_id = req.params.postId

    const posts = await Post.findOne({ _id: post_id }).populate('userID')

    return res.status(200).json({ posts })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Post data cannot be retrieved!' })
  }
})

router.get('/myPost', async (req, res) => {
  try {
    const posts = await Post.find({ userID: req.user._id })
    return res.status(200).json({ posts })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Posts data cannot be retrieved!' })
  }
})

router.get('/:userId/otherPost', async (req, res) => {
  try {
    const posts = await Post.find({ userID: req.params.userId })
    return res.status(200).json({ posts })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Posts data cannot be retrieved!' })
  }
})

router.get('/followingPost', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('following')
    const followingIds = user.following.map((follow) => follow._id)
    followingIds.push(req.user.id)
    const posts = await Post.find({ userID: { $in: followingIds } }).populate(
      'userID'
    )

    return res.status(200).json({ posts })
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
    const comment = await Post.findOne({ _id: post_id }).populate('likes')
    const like = comment
    return res.status(200).json({ like })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'likes data cannot be retrieved!' })
  }
})

router.delete('/:postId/delete', async (req, res) => {
  try {
    const post_id = req.params.postId
    const comment = await Post.findByIdAndDelete(post_id)
    return res.status(200).json({ comment })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'likes data cannot be retrieved!' })
  }
})
module.exports = router
