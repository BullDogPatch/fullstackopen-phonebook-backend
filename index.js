const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');

const app = express();

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];
app.use(express.static('dist'));
app.use(cors());
app.use(morgan('tiny'));

morgan.token('postData', (req, res) => JSON.stringify(req.body));

// Use Morgan middleware with custom format
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postData'
  )
);

app.use(express.json());

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

/* display something at root */
app.get('/', (request, response) => {
  response.send('<h1>Hello, Craig</h1>');
});

/* display all persons */
app.get('/api/persons', (request, response) => {
  response.json(persons);
});

/* display info page */
app.get('/api/info', (request, response) => {
  const personsLength = persons.length;
  const date = Date();
  response.send(
    `<p>Phonebook has info for ${personsLength} people</p><br/><p>${date}</p>`
  );
});

/* display person by id */
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

/* delete person at id */
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});

const generated = () => {
  const uniqueId = Math.random().toString(36);
  return uniqueId;
};

/* add a person */
app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }

  const doesExist = persons.find(person => person.name === body.name);
  if (doesExist) {
    return response.status(400).json({
      error: 'name already exists',
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generated(),
  };

  persons = [...persons, person];
  response.json(person);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
