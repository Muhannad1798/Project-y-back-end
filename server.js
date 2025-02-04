const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const postRouter = require('./controllers/post')
const authRouter = require('./controllers/auth')
const userRouter = require('./controllers/user')
const { verifyToken } = require('./middleware/jwtUtils')
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})
const PORT = process.env.PORT
app.use(express.json())
app.use(cors())

// Routes go here
app.use('/auth', authRouter)
app.use('/user', verifyToken, userRouter)
app.use('/post', verifyToken, postRouter)
app.listen(PORT, () => {
  console.log('The express app is ready!', PORT)
})
