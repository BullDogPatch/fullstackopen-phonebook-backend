const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const Person = require('./models/phonebook');
const cors = require('cors');

const app = express();

app.use(express.static('dist'));
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.get('/', (request, response) => {
  response.send('<h1>Hello, Craig</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(entries => {
    response.json(entries);
  });
});

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

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: 'Internal server error' });
    });
});

app.delete('/api/persons/:id', (request, response) => {
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

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;

  // Check if name or number is missing
  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }

  // Check if the phone number is at least 8 characters long
  if (number.length < 8) {
    return response.status(400).json({
      error: 'invalid phone number: must be at least 8 characters long',
    });
  }

  // Create a new person object
  const person = new Person({
    name: name,
    number: number,
  });

  // Save the new person to the database
  person
    .save()
    .then(savedPerson => {
      console.log(savedPerson);
      response.json(savedPerson);
    })
    .catch(error => {
      if (error.name === 'ValidationError') {
        // Mongoose validation error
        return response.status(400).json({ error: error.message });
      } else {
        // Other types of errors
        return next(error);
      }
    });
});

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
