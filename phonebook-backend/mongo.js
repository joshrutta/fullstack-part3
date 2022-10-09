const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide at least the password,' +
        'name and number arguments: node mongo.js' +
        '<password>');
    process.exit(1);
} else if (process.argv.length == 4) {
    console.log('Please provide the password,' +
        'name and number arguments: node mongo.js' +
        '<password> <name> <number>');
} else if (process.argv.length >= 3) {
    const password = process.argv[2];
    const url = `mongodb+srv://jrutta:${password}@cluster0.cedb4py.mongodb.net/phonebookApp?retryWrites=true&w=majority`
    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    })

    const Person = mongoose.model('Person', personSchema);

    if (process.argv.length == 3) {
        // Display all entities in db

        mongoose
            .connect(url)
            .then((result) => {
                console.log('phonebook:');
                Person.find().then(result => {
                    result.forEach(person => {
                        console.log(`${person.name} ${person.number}`);
                    });
                    mongoose.connection.close();
                });
            });
    }

    if (process.argv.length == 5) {
        // Create new person in db

        const name = process.argv[3];
        const number = process.argv[4];
        mongoose
            .connect(url)
            .then((result) => {
                const note = new Person({
                    name: name,
                    number: number,
                });
                return note.save();
            })
            .then(() => {
                console.log(`added ${name} number ${number} to phoneboook`);
                return mongoose.connection.close();
            })
            .catch(err => console.log(err));
    }
}