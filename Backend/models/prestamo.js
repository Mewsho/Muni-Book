const mongoose = require('mongoose');

const prestamoSchema = mongoose.Schema({
    tipoPrestamo: String,
    ejemplar : { type: mongoose.Schema.Types.ObjectId, ref : 'Ejemplar'},
    fechaPrestamo : { type: Date , default: Date.now },
    fechaDevolucion: { type: Date , default: Date.now },
    fechaDevolucionReal: { type: Date , default: Date.now },
});

module.exports = mongoose.model('Prestamo', prestamoSchema); 