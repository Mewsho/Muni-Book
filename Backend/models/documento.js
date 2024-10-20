const mongoose = require('mongoose');

const documentoSchema = mongoose.Schema({
    tipo: String,
    titulo : String,
    autor: String,
    editorial: String,
    anio : Number,
    edicion : Number,
    categoria: String,
    tipoFisico : String
});

module.exports = mongoose.model('Documento', documentoSchema); 