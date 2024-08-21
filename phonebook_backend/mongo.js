const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password> <name> <number>'
  )
  console.log('To print phone book enter: node mongo.js <password>')
  process.exit(1)
}

const [password, name, number] = process.argv.slice(2)

const url = `mongodb+srv://fullstack:${password}@cluster0.opeqixu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected')
    if (name && number) {
      const person = new Person({
        name,
        number
      })
      return person.save().then((person) => {
        console.log(`Added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
      })
    }
    // write phonebook
    console.log('phonebook:')
    Person.find({}).then((persons) => {
      persons.map((person) => console.log(person.name, person.number))
      mongoose.connection.close()
    })
  })
  .catch((error) => {
    console.log(error)
  })
