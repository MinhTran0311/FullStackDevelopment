const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const username = process.argv[2]
const password = process.argv[3]

const url = `mongodb+srv://${username}:${password}@cluster0.it95xoy.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', noteSchema)

// const person = new Person({
//   name: "Anna",
//   number: "040-1234556",
// });

// person.save().then((result) => {
//   console.log(`padded ${result.name} number ${result.number} to phonebook`);
//   mongoose.connection.close();
// });

Person.find({}).then((result) => {
  console.log('phonebook')
  result.forEach((person) => {
    console.log(`${person.name} ${person.number}`)
  })
  mongoose.connection.close()
})
