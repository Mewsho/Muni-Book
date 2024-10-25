const mongoose = require('mongoose');

const ejemplarSchema = mongoose.Schema({
    codigo: Number,
    estado: Number, 
    estadoTexto: String,
    ubicacion: String,
    documento : { type: mongoose.Schema.Types.ObjectId, ref : 'Documento'}
});

module.exports = mongoose.model('Ejemplar', ejemplarSchema); 