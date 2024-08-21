/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @stylistic/js/semi */
/* eslint-disable @stylistic/js/linebreak-style */
/* eslint-disable @stylistic/js/quotes */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const Person = require('./models/person')

// custom token for morgan
morgan.token('postData', function (req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

//Middlewares
app.use(express.json())
//app.use(morgan("tiny"));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postData'
  )
)
app.use(cors())
app.use(express.static('dist'))

// Middleware to parse JSON bodies
app.use(bodyParser.json())

let persons = [
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

///Mongo definition

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.status(200).json(person)
      } else {
        response.status(404).json({
          error: `There is no person with this id: ${request.params.id}`
        })
      }
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
      `)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (!result) {
        response.status(400).send(request.params.id + ' was not found')
      } else {
        response.status(204).send(`${result.name} was deleted.`)
      }
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    const missing = !body.name ? 'Name' : 'Number'
    return response.status(400).json({ error: `'${missing}' is missing` })
  }
  Person.findOne({ name: body.name })
    .then((person) => {
      if (person) {
        response
          .status(400)
          .json({ error: `${person.name} name must be unique` })
      } else {
        const person = new Person({
          name: body.name,
          number: body.number
        })
        person
          .save()
          .then((savedPerson) => response.json(savedPerson))
          .catch((error) => next(error))
      }
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', async (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      { name, number },
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    )

    if (!updatedPerson) {
      return response.status(400).json({
        error: `No person with this id: '${id}'`
      })
    }

    response.status(200).json(updatedPerson)
  } catch (error) {
    next(error)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint
app.use(unknownEndpoint)

//error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
// handler of requests with result to errors
app.use(errorHandler)
