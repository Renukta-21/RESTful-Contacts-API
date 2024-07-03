const mongoose = require('mongoose')

const contact = new mongoose.Schema({
  name: String,
  number: Number
})

const Contact = mongoose.model('Contact', contact)

contact.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject._id
  }
})

module.exports = Contact
