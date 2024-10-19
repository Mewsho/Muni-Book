const mongoose = require('mongoose');

const moment = require('moment-timezone');
const dateSantiago = moment.tz(Date.now(), "America/Santiago");

const solicitudPrestamoSchema = mongoose.Schema({
    usuario : { type: mongoose.Schema.Types.ObjectId, ref : 'Usuario'},
    fechaSolicitud : { type: Date , default: Date.now },
    prestamos: [{ type: mongoose.Schema.Types.ObjectId, ref : 'Prestamo'}],
    esReserva : Boolean
});

module.exports = mongoose.model('SolicitudPrestamo', solicitudPrestamoSchema); 