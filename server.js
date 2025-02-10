const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const postRouter = require('./controllers/post')
const commentRouter = require('./controllers/comment')

const authRouter = require('./controllers/auth')
const userRouter = require('./controllers/user')
const conversationRouter = require('./controllers/conversation')

const { verifyToken } = require('./middleware/jwtUtils')
const morgan = require('morgan')
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})
const PORT = process.env.PORT
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
// Routes go here
app.use('/auth', authRouter)
app.use('/user', verifyToken, userRouter)
app.use('/post', verifyToken, postRouter)
app.use('/comment', verifyToken, commentRouter)
app.use('/chat', verifyToken, conversationRouter)

app.listen(PORT, () => {
  console.log('The express app is ready!', PORT)
})
