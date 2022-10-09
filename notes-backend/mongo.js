const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2]

const url = `mongodb+srv://jrutta:${password}@cluster0.cedb4py.mongodb.net/noteApp?retryWrites=true&w=majority`
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema);

// Making new note

// mongoose
//     .connect(url)
//     .then((result) => {
//         console.log('connected');

//         const note = new Note({
//             content: 'Note #3!',
//             date: new Date(),
//             important: true,
//         })

//         return note.save()
//     })
//     .then(() => {
//         console.log('note saved!');
//         return mongoose.connection.close()
//     })
//     .catch(err => console.log(err))

// Fetching objects from db
mongoose
    .connect(url)
    .then((result) => {
        console.log('connected');
        Note.find().then(result => {
            result.forEach(note => {
                console.log(note);
            });
            mongoose.connection.close();
        });
    });