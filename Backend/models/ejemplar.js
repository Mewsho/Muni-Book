const mongoose = require('mongoose');

const ejemplarSchema = mongoose.Schema({
    estado: Boolean,
    ubicacion: String,
    documento : { type: mongoose.Schema.Types.ObjectId, ref : 'Documento'}
});

module.exports = mongoose.model('Ejemplar', ejemplarSchema); 