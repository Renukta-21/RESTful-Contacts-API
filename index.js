require('dotenv').config()
const Contact = require('./models/contact')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

let userEntries = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

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

app.get('/contacts/:id', (req, res) => {
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
})

app.delete('/contacts/:id', (req, res) => {
  const id = Number(req.params.id)
  const exixts = userEntries.find(user => user.id === id)

  if (exixts) {
    userEntries = userEntries.filter(user => user.id !== id)
    res.send(exixts)
  } else {
    res.status(404).send({ error: 'User not in DB' })
  }
})
app.get('/info', (req, res) => {
  const fecha = new Date()
  const horas = fecha.getHours().toString().padStart(2, '0')
  const minutos = fecha.getMinutes().toString().padStart(2, '0')
  const segundos = fecha.getSeconds().toString().padStart(2, '0')
  const horaFormateada = `${horas}:${minutos}:${segundos}`

  res.send(
        `<p>Phonebook has info for ${userEntries.length} people</p>
        <p>${new Date().toDateString()}  ${horaFormateada} </p>
        `)
})

app.post('/contacts', (req, res) => {
  const newContact = new Contact({
    name: 'Hola pendejines',
    number: 5630561334
  })
  newContact.save()
    .then((result) => {
      console.log('New contact added succefully: ' + result)
      res.send(result)
    })
    .catch(err => console.log('An error has ocurred: ' + err))
})

const unknownPath = (req, res) => {
  res.status(404).send({ error: 'Path not found' })
}
app.use(unknownPath)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server started on ${PORT}`)
  console.log('')
})
