const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const User = require('./models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Note = require('./models/noteModel');

const JWT_SECRET = 'notesapp';

// Conexión a MongoDB
const mongoURI = 'mongodb+srv://oqnd2:Oquendo_2003@taskmanager.rmiye.mongodb.net/?retryWrites=true&w=majority&appName=taskManager';
app.use(cors());
app.use(express.json());  // Middleware para parsear JSON

// Opciones de la base de datos
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Conectar a base de datos
mongoose.connect(mongoURI, options)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB', err));

// Ruta para crear un usuario
app.post('/register', async (req, res) => {
    try {
        const { email, name, password } = req.body; 

        const alreadyExist = await User.findOne({ email });
        if (alreadyExist) {
            return res.status(400).json({ error: 'Ya hay una cuenta registrada con este correo electrónico' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashPassword
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: savedUser });
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//Ruta para iniciar sesión
app.post('/login', async (req, res) =>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({error: 'No hay una cuenta registrada con esta direccion de correo'});
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        
        if(!passwordIsValid){
            return res.status(400).json({error: 'Contraseña incorrecta'})
        }

        const token = jwt.sign({ userId: user._id, userName: user.name }, JWT_SECRET, { expiresIn: '1h' });

        res.json({token, name: user.name, id: user._id, message: 'Inicio de sesión exitoso.'});

    }catch (err) {
        res.status(400).json({error: err.message});
    }
});

//Ruta para crear nota
app.post('/addnote', async (req,res) => {
    try{
        const { userId, title, note } = req.body;

        const newNote = new Note({
            title,
            note,
            userId
        });

        try {
            await newNote.save();
            res.status(201).json({message: 'Nota creada con éxito'});
        }catch (err){
            res.status(500).json({error: err.message});
        }
    }catch (err){
        res.status(400).json({error: err.message});
    }
});

//Ruta para consultar las notas
app.post('/notes', async (req,res) => {
    try{
        const userId = req.body.userId;

        const notes = await Note.find({userId});

        res.json(notes);
    }catch (err){
        res.status(400).json({error: err.message});
    }
});

//Ruta para eliminar una nota
app.post('/deletenote', async (req, res) => {
    const noteId = req.body.noteId;

    try{
        const result = await Note.findByIdAndDelete(noteId);

        if(!result){
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        res.json({ message: 'Nota eliminada con éxito' });
        
    }catch (err){
        res.status(400).json({error: err.message});
    }
})

//Ruta para editar una nota
app.post('/editnote', async (req, res) => {
    const {noteId, title, note} = req.body;

    try{
        const editNote = await Note.findByIdAndUpdate(noteId, {title, note}, {new: true});

        if (!editNote){
            return res.status(404).json({error: 'Nota no encontrada'});
        }

        res.json({message : 'Nota actualizada con éxito'});
    }catch (err){
        res.status(400).json({error: err.message});
    }
})

// Mensaje de inicio
app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
});
