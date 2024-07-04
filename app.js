const express = require('express')
const app = express()
const cors = require('cors')
const { unknownPath, errorHandler } = require('./utils/middleware')
const contactRouter = require('./controllers/contacts')
const { logger } = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Mongo Db is now connected '))
  .catch(err => console.log('An error has ocurred ' + err))

app.use(cors())
app.use(express.json())
app.use(logger)

app.use('/contacts', contactRouter)

app.use(unknownPath)
app.use(errorHandler)

module.exports = app
