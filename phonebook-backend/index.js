const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// eslint-disable-next-line no-unused-vars
morgan.token('post-body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))

// const requestLogger = (request, response, next) => {
//     console.log("Method: ", request.method);
//     console.log("Path: ", request.path);
//     console.log("Body: ", request.body);
//     console.log("---");
//     next();
// }

// app.use(requestLogger);

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// app.get('/api/info', (request, response) => {
//     response.send(`
//         <p>Phonebook has info for ${persons.length} people</p>
//         <p>${new Date()}</p>
//     `)
// })

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        throw new Error('No person found with that ID')
        // response.status(400).json({ "error": "No person found with that ID" })
      } else {
        response.json(person)
      }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

// const generateId = () => {
//     return Math.floor(Math.random() * 10000)
// }

const isEmpty = (body) => {
  if (!body.name || !body.number) {
    return true
  }
  return false
}

// const nameInPhonebook = (body) => {
//   const names = persons.map(person => person.name)
//   return names.includes(body.name)
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (isEmpty(body)) {
    return response.status(400).json({
      error: 'name and number must be non-empty'
    })
    // } else if (nameInPhonebook(body)) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})