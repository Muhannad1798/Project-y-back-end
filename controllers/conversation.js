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
    return res
      .status(500)
      .json({ error: 'Something went wrong with DM. Try again later' })
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
    return res
      .status(500)
      .json({ error: 'Message cannot be sent!. Try again later.' })
  }
})

router.get('/:convId/dm', async (req, res) => {
  try {
    const comment = await Message.find({ convID: req.params.convId })
    return res.status(200).json({ comment })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Message data cannot be retrieved!' })
  }
})

router.get('/dm/conv', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const conversations = await Conversation.find({
      $or: [{ firstUser: req.user._id }, { secondUser: req.user._id }]
    })

    const convDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const otherUserId =
          conversation.firstUser.toString() === req.user._id.toString()
            ? conversation.secondUser
            : conversation.firstUser

        const otherUser = await User.findById(otherUserId)

        const lastMessage = await Message.findOne({ convID: conversation._id })
          .sort({ createdAt: -1 })
          .limit(1)

        return {
          conversation,
          otherUser,
          lastMessage: lastMessage ? lastMessage.message : 'No messages yet'
        }
      })
    )

    res.status(200).json({ conversations: convDetails })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to retrieve conversations' })
  }
})

module.exports = router
