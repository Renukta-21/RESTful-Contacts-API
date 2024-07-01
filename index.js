require('dotenv').config()
const Contact = require('./models/contact')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
app.use(cors())
app.use(express.json())

const welcomeAPI =
`<h2>Porfavor continue con los endpoints apropiados</h2>
<p>/contacts GET all DB items</p>
<p>/contacts/:id GET specific element</p>

`
morgan.token('body', (req, res) => {
  if (req.method === 'POST' || req.method === 'PUT') return JSON.stringify(req.body)
})
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res).padEnd(5, ' '),
    tokens.url(req, res).padEnd(12, ' '),
    tokens.status(req, res).padEnd(5, ' '),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
})
)

app.get('/', (req, res) => { res.send(welcomeAPI) })

app.get('/contacts', (req, res) => {
  Contact.find({})
    .then(contact => {
      console.log(contact)
      res.json(contact)
    })
    .catch(err => console.log('An error has ocurred: ' + err))
})

app.get('/contacts/:id', (req, res, next) => {
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

app.delete('/contacts/:id', (req, res, next) => {
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

/* app.get('/info', (req, res) => {
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

app.post('/contacts', (req, res) => {
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
app.put('/contacts/:id', (req, res) => {
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
const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted Id' })
  }
}
app.use(errorHandler)

const unknownPath = (req, res) => {
  res.status(404).send({ error: 'Path not found' })
}
app.use(unknownPath)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server started on ${PORT}`)
  console.log('')
})
