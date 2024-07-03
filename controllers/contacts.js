const contactRouter = require('express').Router()
const Contact = require('../models/contact')

const welcomeAPI =
`<h2>Porfavor continue con los endpoints apropiados</h2>
<p>/contacts GET all DB items</p>
<p>/contacts/:id GET specific element</p>

`

contactRouter.get('/', (req, res) => { res.send(welcomeAPI) })

contactRouter.get('/contacts', (req, res) => {
  Contact.find({})
    .then(contact => {
      console.log(contact)
      res.json(contact)
    })
    .catch(err => console.log('An error has ocurred: ' + err))
})

contactRouter.get('/contacts/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(response => {
      if (!response) {
        const errorString = `Contact with ID=${req.params.id} wasn't found`
        console.log(errorString)
        return res.status(400).send({ error: errorString })
      }
      console.log('Se encontro JAJAJA ' + response)
      res.send(response)
    })
    .catch(err => {
      next(err)
    })
})

contactRouter.delete('/contacts/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(response => {
      console.log(`Response: ${response}`)
      if (!response) return res.status(404).send({ error: 'Id not found' })
      res.status(204).end()
    })
    .catch(err => {
      next(err)
    })
})

/* contactRouter.get('/info', (req, res) => {
  const fecha = new Date()
  const horas = fecha.getHours().toString().padStart(2, '0')
  const minutos = fecha.getMinutes().toString().padStart(2, '0')
  const segundos = fecha.getSeconds().toString().padStart(2, '0')
  const horaFormateada = `${horas}:${minutos}:${segundos}`

  res.send(
        `<p>Phonebook has info for ${userEntries.length} people</p>
        <p>${new Date().toDateString()}  ${horaFormateada} </p>
        `)
}) */

contactRouter.post('/contacts', (req, res) => {
  const newContact = new Contact({
    name: req.body.name,
    number: req.body.number
  })
  newContact.save()
    .then((result) => {
      console.log('New contact added succefully: ' + result)
      res.send(result)
    })
    .catch(err => {
      console.log('An error has ocurred: ' + err)
    })
})

contactRouter.put('/contacts/:id', (req, res) => {
  const updatedContact = {
    name: req.body.name,
    number: req.body.number
  }
  Contact.findByIdAndUpdate(req.params.id, updatedContact, { new: true })
    .then(response => {
      console.log(response)
      res.status(200).end()
    })
})

module.exports = contactRouter
