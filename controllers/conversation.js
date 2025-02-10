const { signToken } = require('../middleware/jwtUtils')
const User = require('../models/User')
const Conversation = require('../models/Conversation')
const router = require('express').Router()
router.post('/:userId/profile/dm', async (req, res) => {
  try {
    if (req.user._id === req.params.userId) {
      return res.status(600).json({ error: 'you can not chat with yourself' })
    }
    const user_id = req.params.userId
    const user = await User.findById(req.user._id)

    const usersConv = user.conversation
    let conversation_id
    let conver = {}
    let conv2 = {}

    usersConv.forEach(async (user) => {
      if (user_id == user) {
        conver = await Conversation.find({
          firstUser: user_id,
          secondUser: req.user._id
        })
        if (conver.length == 0) {
          conv2 = await Conversation.find({
            firstUser: req.user._id,
            secondUser: user_id
          })
          console.log('conv2', conv2)
        } else {
        }
      }
    })

    return res.status(200).json({ conv2 })

    /* req.body.firstUser = req.user._id
      req.body.secondUser = user_id
      const newConvo = await Conversation.create(req.body)
      const updateAnotherUser = await User.findByIdAndUpdate(req.user._id, {
        $push: { conversation: user_id }
      })

      const updateUser = await User.findByIdAndUpdate(user_id, {
        $push: { conversation: req.user._id }
      })

      conversation_id = newConvo*/

    req.body.firstUser = req.user._id
    req.body.secondUser = user_id
    const newConvo = await Conversation.create(req.body)
    const updateAnotherUser = await User.findByIdAndUpdate(req.user._id, {
      $push: { conversation: user_id }
    })

    const updateUser = await User.findByIdAndUpdate(user_id, {
      $push: { conversation: req.user._id }
    })

    // return res.status(200).json({ newConvo })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Shops data cannot be retrieved!' })
  }
})
module.exports = router
