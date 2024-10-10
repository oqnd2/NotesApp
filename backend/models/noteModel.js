const mongoose = require('mongoose')
const {Schema} = mongoose;

//Definir el schema de las notas
const notesSchema = new Schema({
    title: {type: String, required: true},
    note: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    creationDate: {type: Date, default: Date.now}
});

const Note = mongoose.model('Note', notesSchema);

module.exports = Note;