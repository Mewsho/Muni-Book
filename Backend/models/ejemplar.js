const mongoose = require('mongoose');

const ejemplarSchema = mongoose.Schema({
    estado: Number,
    ubicacion: String,
    documento : { type: mongoose.Schema.Types.ObjectId, ref : 'Documento'},
    estadoTexto: String
});

module.exports = mongoose.model('Ejemplar', ejemplarSchema); 