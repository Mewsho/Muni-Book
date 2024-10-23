const mongoose = require('mongoose');

const moment = require('moment-timezone');
const dateSantiago = moment.tz(Date.now(), "America/Santiago");

const solicitudPrestamoSchema = mongoose.Schema({
    tipoSolicitud: String,
    estadoSolicitud: Number,
    fechaSolicitud : { type: Date , default: Date.now },
    usuario : { type: mongoose.Schema.Types.ObjectId, ref : 'Usuario'},
    prestamos: [{ type: mongoose.Schema.Types.ObjectId, ref : 'Prestamo'}]
    
});

module.exports = mongoose.model('SolicitudPrestamo', solicitudPrestamoSchema); 