const mongoose = require('mongoose');

if (
  process.argv.length < 3 ||
  (process.argv.length > 3 && process.argv.length < 5)
) {
  console.log(`USAGE: node mongo.js password name number`);
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://craigclayton:${password}@cluster0.xpxvblq.mongodb.net/PhoneBook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const PhonebookSchema = {
  name: String,
  number: String,
};

const Person = mongoose.model('Number', PhonebookSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length === 3) {
  Booklet.find({}).then(result => {
    result.forEach(item => {
      console.log(item);
    });
  });
}

person.save().then(result => {
  console.log(`added ${result.name} to the Phonebook`, result);
  mongoose.connection.close();
});
