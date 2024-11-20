const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    rut: String,
    nombres : String,
    apellidos: String,
    direccion: String,
    telefono : Number,
    activo : Boolean,
    codigo: Number,
    correo: String,
    password : String,
    tipoUsuario: Number,
    fechaSancion: Date
});

module.exports = mongoose.model('Usuario', usuarioSchema); 