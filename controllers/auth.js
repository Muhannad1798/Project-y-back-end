const { signToken } = require('../middleware/jwtUtils')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const router = require('express').Router()

router.post('/signup', async (req, res) => {
  try {
    const { username, password, phoneNumber, email, name } = req.body
    if (!username || !password || !phoneNumber || !email || !name)
      return res.status(400).json({ error: 'Missing required fields.' })
    const userExist = await User.findOne({ username })
    if (userExist)
      return res.status(409).json({ error: 'Username already taken.' })
    const emailExist = await User.findOne({ email })
    if (userExist)
      return res.status(409).json({ error: 'Email already exist.' })
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT)
    const user = await User.create({
      username,
      password: hashedPassword,
      phoneNumber,
      email,
      name
    })
    const token = signToken(user)
    return res.status(201).json({ message: 'User created', token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password)
      return res.status(400).json({ error: 'Missing required fields.' })
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ error: 'Bad request.' })
    const matched = bcrypt.compareSync(password, user.password)
    if (!matched) return res.status(400).json({ error: 'Bad request.' })
    const token = signToken(user)
    return res.status(201).json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

module.exports = router
