const User = require('../models/User')
const Post = require('../models/Post')
const router = require('express').Router()

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    return res.status(201).json(user)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'Something went wrong with the user profile!' })
  }
})
router.get('/:userId/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    return res.status(201).json(user)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'Something went wrong with the user profile!' })
  }
})

router.get('/:userId/following', async (req, res) => {
  try {
    const user_id = req.params.userId

    const comment = await User.findOne({ _id: user_id }).populate('following')

    const following = comment.following
    return res.status(200).json({ following })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'likes data cannot be retrieved!' })
  }
})

router.get('/:userId/followers', async (req, res) => {
  try {
    const user_id = req.params.userId
    const comment = await User.findOne({ _id: user_id }).populate('followers')

    const followers = comment.followers
    return res.status(200).json({ followers })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: 'something went wrong data cannot be retrieved!!' })
  }
})

router.get('/:userId/isFollowing', async (req, res) => {
  try {
    const comment = await User.findOne({ _id: req.user._id }).populate(
      'following'
    )
    const following = comment.following
    return res.status(200).json({ following })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: 'something went wrong data cannot be retrieved!!' })
  }
})

router.get('/users', async (req, res) => {
  try {
    const user = await User.find({})
    return res.status(201).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong with the users!' })
  }
})

router.post('/:userId/follow', async (req, res) => {
  try {
    if (req.user._id === req.params.userId) {
      return res.status(600).json({ error: 'you can not follow yourself' })
    }
    const id = req.params.userId
    const follow = await User.findByIdAndUpdate(id, {
      $push: { followers: req.user._id }
    })
    const iFollow = await User.findByIdAndUpdate(req.user._id, {
      $push: { following: id }
    })

    return res.status(200).json({ follow })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: 'There is an issue with the follow button try again later'
    })
  }
})

router.post('/:userId/unfollow', async (req, res) => {
  try {
    const id = req.params.userId
    const follow = await User.findByIdAndUpdate(id, {
      $pull: { followers: req.user._id }
    })
    const iFollow = await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: id }
    })
    return res.status(200).json({ follow })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: 'There is an issue with the unfollow button try again later'
    })
  }
})

router.get('/:userId/profile/followers', async (req, res) => {
  try {
    const id = req.params.userId
    const comment = await User.findById({ _id: id }).populate('followers')

    const followers = []
    comment.followers.forEach((com) => {
      obj = {
        username: com.username,
        name: com.name,
        phonenumber: com.phoneNumber
      }

      followers.push(obj)
    })
    return res.status(200).json({ followers })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: 'followers data cannot be retrieved!' })
  }
})

router.get('/:userId/profile/following', async (req, res) => {
  try {
    const id = req.params.userId
    const comment = await User.findById({ _id: id }).populate('following')

    const following = []
    comment.following.forEach((com) => {
      obj = {
        username: com.username,
        name: com.name,
        phonenumber: com.phoneNumber
      }

      following.push(obj)
    })
    return res.status(200).json({ following })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: 'following data cannot be retrieved!' })
  }
})

router.put('/edit/profile', async (req, res) => {
  try {
    const { bio, pic } = req.body
    const user = await User.findByIdAndUpdate(req.user._id, {
      bio,
      pic
    })
    console.log(user)

    return res.status(201).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong with the users!' })
  }
})

module.exports = router
