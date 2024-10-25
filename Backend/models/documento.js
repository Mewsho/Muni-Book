const mongoose = require('mongoose');

const documentoSchema = mongoose.Schema({
    titulo : String,
    autor: String,
    editorial: String,
    anioSalida : Number,
    edicion : Number,
    codigo: String,
    tipoDocumento : { type: mongoose.Schema.Types.ObjectId, ref : 'TipoDocumento'},
    categoriaDocumento : { type: mongoose.Schema.Types.ObjectId, ref : 'CategoriaDocumento'}
});

module.exports = mongoose.model('Documento', documentoSchema); 