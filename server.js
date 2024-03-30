const express = require('express');
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

app.use(express.json());

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
  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'details missing',
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generated(),
  };

  persons = persons.concat(person);
  console.log(person);
  response.json(person);
});

const PORT = 3002;
app.listen(PORT);
console.log(`app listening on port ${PORT}`);
