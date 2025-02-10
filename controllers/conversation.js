const { signToken } = require('../middleware/jwtUtils')
const User = require('../models/User')
const Message = require('../models/message')
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
    let conversation_id = await convId(usersConv, req.user._id, user_id)
    console.log(conversation_id)

    if (conversation_id == 0) {
      req.body.firstUser = req.user._id
      req.body.secondUser = user_id
      const newConvo = await Conversation.create(req.body)
      const updateAnotherUser = await User.findByIdAndUpdate(req.user._id, {
        $push: { conversation: user_id }
      })

      const updateUser = await User.findByIdAndUpdate(user_id, {
        $push: { conversation: req.user._id }
      })
      return res.status(200).json({ newConvo })
    } else {
      return res.status(200).json({ conversation_id })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Shops data cannot be retrieved!' })
  }
})
const convId = async (usersConv, fId, sId) => {
  let conver, conv2

  for (const user of usersConv) {
    if (sId == user) {
      conver = await Conversation.find({
        firstUser: sId,
        secondUser: fId
      })

      if (conver.length == 0) {
        conv2 = await Conversation.find({
          firstUser: fId,
          secondUser: sId
        })
        return conv2
      } else if (conver.length == 0) {
        return conver
      }
    }
  }

  return 0
}

router.post('/:convId/dm', async (req, res) => {
  try {
    req.body.sender = req.user._id
    req.body.convID = req.params.convId
    const comment = await Message.create(req.body)
    return res.status(200).json({ comment })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Shops data cannot be retrieved!' })
  }
})

router.get('/:convId/dm', async (req, res) => {
  try {
    const comment = await Message.find({ convID: req.params.convId })
    return res.status(200).json({ comment })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Shops data cannot be retrieved!' })
  }
})

module.exports = router
