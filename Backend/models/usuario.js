const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    rut: Number,
    nombres : String,
    apellidos: String,
    direccion: String,
    telefono : Number,
    activo : Boolean,
    correo: String,
    password : String
});

module.exports = mongoose.model('Usuario', usuarioSchema); 