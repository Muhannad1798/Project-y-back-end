const User = require('../models/User')
const router = require('express').Router()

router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        return res.status(201).json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong!' })
    }
})

module.exports = router