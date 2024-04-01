const mongoose = require('mongoose');

if (process.argv < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://craigclayton:${password}@cluster0.xpxvblq.mongodb.net/PhoneBook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const PhonebookSchema = {
  name: String,
  number: Number,
};

const Booklet = mongoose.model('Booklet', PhonebookSchema);

const booklet = new Booklet({
  name: 'Craig Clayton',
  number: 30303030,
});

booklet.save().then(result => {
  console.log('booklet saved', result);
  mongoose.connection.close();
});
