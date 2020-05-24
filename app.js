const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
  
  const mongoUrl = config.MONGODB_URI
  mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  
  app.use(cors())
  app.use(express.json())

  
  app.use(middleware.tokenExtractor)
  app.use('/api/blogs', blogsRouter)
  app.use('/api/users', usersRouter)
  app.use('/api/login', loginRouter)

  module.exports = app