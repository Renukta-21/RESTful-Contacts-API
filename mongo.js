const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const DB_URI = `mongodb+srv://fullstack:${password}@cluster0.hlmbvx6.mongodb.net/ContactsApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(DB_URI)
  .then(() => console.log('Mongo Db is now connected '))
  .catch(err => console.log('An error has ocurred ' + err))

const contact = new mongoose.Schema({
  name: String,
  number: Number
})

const Contact = mongoose.model('Contact', contact)

if (name === undefined || number === undefined) {
  Contact.find({})
    .then(res => {
      console.log('')
      console.log('Phonebook:')
      res.forEach(elm => {
        console.log(`${elm.name} ${elm.number}`)
      })
    })
    .catch(err => console.log('No se ha podido acceder a los recursos solicitados ' + err))
    .finally(() => mongoose.connection.close())
} else {
  const newContact = new Contact({
    name: process.argv[3],
    number: process.argv[4]
  })

  newContact.save()
    .then(res => console.log(`Added ${name} number ${number} to phonebook`))
    .catch(err => console.log('An error has ocurred trying to save the contact ' + err))
    .finally(() => mongoose.connection.close())
}
