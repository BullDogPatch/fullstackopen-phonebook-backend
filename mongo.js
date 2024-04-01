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

const Booklet = mongoose.model('Booklet', PhonebookSchema);

const booklet = new Booklet({
  name: process.argv[3],
  number: process.argv[4],
});
booklet.save().then(result => {
  console.log('booklet saved', result);
  mongoose.connection.close();
});
