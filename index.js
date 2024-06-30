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
})

app.get('/contacts/:id', (req, res) => {
  const id = Number(req.params.id)
  const entry = userEntries.find(user => user.id === id)
  if (entry) {
    return res.send(entry)
  }
  res.status(404).send({ error: 'User not found' })
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

const getNewID = () => Math.max(...userEntries.map(user => user.id)) + 1
app.post('/contacts', (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({ error: 'No seas perra, usa la API bien' })
  } else {
    const userReg = userEntries.find(user => user.name.toLowerCase() === req.body.name.toLowerCase())
    if (userReg) {
      return res.status(409).send({ error: 'User already exists' })
    }
    const newContact = {
      id: getNewID(),
      name: req.body.name,
      number: req.body.number || 'Not-specified'
    }
    userEntries = userEntries.concat(newContact)
    res.send(newContact)
  }

  res.end()
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
