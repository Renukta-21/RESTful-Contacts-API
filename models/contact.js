const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Mongo Db is now connected '))
  .catch(err => console.log('An error has ocurred ' + err))

const contact = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  number: String
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
