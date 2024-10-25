const mongoose = require('mongoose');

const tipoDocumentoSchema = mongoose.Schema({
    tipo: String
});

module.exports = mongoose.model('TipoDocumento', tipoDocumentoSchema); 