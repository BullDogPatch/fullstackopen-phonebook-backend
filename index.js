const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const Person = require('./models/phonebook');
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

/* display something at root */
app.get('/', (request, response) => {
  response.send('<h1>Hello, Craig</h1>');
});

/* display all persons */
app.get('/api/persons', (request, response) => {
  Person.find({}).then(entries => {
    response.json(entries);
  });
});

/* display info page */
/* display info page */
app.get('/api/info', async (request, response) => {
  try {
    const count = await Person.countDocuments({});
    const date = new Date().toUTCString();
    response.send(
      `<p>Phonebook has info for ${count} people</p><br/><p>${date}</p>`
    );
  } catch (error) {
    response.status(500).json({ error: 'Internal server error' });
  }
});

/* display person by id */
app.get('/api/persons/:id', (request, response) => {
  // const id = Number(request.params.id);
  Person.findById(id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

/* delete person at id */
app.delete('/api/persons/:id', (request, response) => {
  // const id = Number(request.params.id);
  // persons = persons.filter(person => person.id !== id);
  // response.status(204).end();

  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end();
  });
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

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

  const person = new Person({
    name: body.name,
    number: body.number,
    // id: generated(),
  });

  person.save().then(savedPerson => {
    console.log(savedPerson);
    response.json(savedPerson);
  });
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 8080; // Use the port defined in .env or default to 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
