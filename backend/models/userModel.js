const mongoose = require('mongoose');
const { Schema } = mongoose;

// Definir el esquema de usuario
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Crear el modelo de usuario
const User = mongoose.model('User', userSchema);

// Exportar el modelo
module.exports = User;
