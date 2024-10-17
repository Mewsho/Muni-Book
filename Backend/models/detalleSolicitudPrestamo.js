const mongoose = require('mongoose');

const detalleSolicitudPrestamoSchema = mongoose.Schema({
    ejemplares : [{ type: mongoose.Schema.Types.ObjectId, ref : 'Documento'}],
    solicitud : { type: mongoose.Schema.Types.ObjectId, ref : 'SolicitudPrestamo'}
});

module.exports = mongoose.model('DetalleSolictudPrestamo', detalleSolicitudPrestamoSchema); 