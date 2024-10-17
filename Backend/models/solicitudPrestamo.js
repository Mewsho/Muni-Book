const mongoose = require('mongoose');

const solicitudPrestamoSchema = mongoose.Schema({
    usuario : { type: mongoose.Schema.Types.ObjectId, ref : 'Usuario'},
    fechaSolicitud : { type: Date , default: Date.now },
    prestamos: [{ type: mongoose.Schema.Types.ObjectId, ref : 'Prestamo'}],
    esReserva : Boolean
});

module.exports = mongoose.model('SolicitudPrestamo', solicitudPrestamoSchema); 