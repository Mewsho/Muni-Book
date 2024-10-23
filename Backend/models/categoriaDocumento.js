const mongoose = require('mongoose');

const categoriaDocumentoSchema = mongoose.Schema({
    categoria: String
});

module.exports = mongoose.model('CategoriaDocumento', categoriaDocumentoSchema); 