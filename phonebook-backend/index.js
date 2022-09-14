const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json());

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

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.filter(person => person.id === id);
    if (person.length) {
        response.json(person);
    } else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

const isEmpty = (body) => {
    if (!body.name || !body.number) {
        return true
    }
    return false
}

const nameInPhonebook = (body) => {
    const names = persons.map(person => person.name);
    return names.includes(body.name)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (isEmpty(body)) {
        return response.status(400).json({
            error: 'name and number must be non-empty'
        })
    } else if (nameInPhonebook(body)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    };

    persons = persons.concat(person);
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})