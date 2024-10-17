const express = require('express'); //Imortar librerias internas
const mongoose = require('mongoose');
const cors = require('cors');

const {ApolloServer, gql} = require('apollo-server-express'); //Importar librerias externas

const DetalleSolicitudPrestamo = require('./models/detalleSolicitudPrestamo.js');
const Documento = require('./models/documento');
const Ejemplar = require('./models/ejemplar');
const Prestamo = require('./models/prestamo')
const SolicitudPrestamo = require('./models/solicitudPrestamo')
const Usuario = require('./models/usuario');

mongoose.connect('mongodb+srv://FcoTorres:hEqGLg4XvhwgO9y5@cluster0.45avn.mongodb.net/BaseBiblioteca',{useNewUrlParser: true, useUnifiedTopology:true});

const typeDefs = gql`

    type Usuario{
        id: ID!
        rut: Number!
        nombres: String!
        apellidos: String!
        direccion: String!
        telefono: Number!
        activo: Number!
        correo: String!
        password: String!
    }

    input UsuarioInput{
        rut: Number!
        nombres: String!
        apellidos: String!
        direccion: String!
        telefono: Number!
        activo: Number!
        correo: String!
        password: String!
    }

    type Prestamo{
        id: ID!
        tipoPrestamo: String!
        ejemplar: Ejemplar!
        fechaPrestamo: String!
        fechaDevolucion: Date!
        fechaDevolucionReal: Date!
        solicitudPrestamo: SolicitudPrestamo
    }

    input PrestamoInput{
        tipoPrestamo: String!
        ejemplar: Ejemplar!
        fechaPrestamo: String!
        fechaDevolucion: Date!
        fechaDevolucionReal: Date!
        solicitudPrestamo: SolicitudPrestamo
    }

    type Ejemplar{
        id: ID!
        documento: Documento
        estado: Number!
        ubicacion: String!
    }

    input EjemplarInput{
        documento: Documento
        estado: Number!
        ubicacion: String!
        }

    type Documento{
        id: ID!
        tipo: String!
        titulo: String!
        autor: String!
        editorial: String!
        anio: Number!
        edicion: Number!
        categoria: String!
        tipoMedio: String!
    }

    input DocumentoInput{
        tipo: String!
        titulo: String!
        autor: String!
        editorial: String!
        anio: Number!
        edicion: Number!
        categoria: String!
        tipoMedio: String!
        }

    type DetalleSolicitudPrestamo{
        id: ID!
        ejemplares: [Ejemplar]
        solicitud: SolicitudPrestamo
    }

    input DetalleSolicitudPrestamoInput{
        ejemplares: [Ejemplar]
        solicitud: SolicitudPrestamo
    }

    type SolicitudPrestamo{
        id: ID!
        usuario: Usuario
        fechaSolicitud: Date!
        prestamos: [Prestamo]
        esReserva: Boolean

    }

    input SolicitudPrestamoInput{
        usuario: Usuario
        fechaSolicitud: Date!
        prestamos: [Prestamo]
        esReserva: Boolean
    }

    type Alert{
        message: String
    }

    type Response{
        statusCode: String
        body: String
        errorCode: String
        descriptionError: String
    }

    type Query{
        getUsuarios: [Usuarios]
        getUsuarioById(id: ID!): Usuario
        getUsuarioByRut(rut: Number!): Usuario
        getPrestamos: [Prestamo]
        getPrestamosEjemplar: [Prestamo]
        getPrestamoById(id: ID!): Prestamo
        getPrestamoByIdEjemplar(id: ID!): Prestamo
        getSolicitudPrestamos: [SolicitudPrestamos]
        getSolicitudPrestamosUsuario: [SolicitudPrestamos]
        getSolicitudPrestamoById(id: ID!): SolicitudPrestamos
        getSolicitudPrestamoByIdUsuario(id: ID!): SolicitudPrestamos
        getSolicitudPrestamosPrestamos: [SolicitudPrestamos]
        getSolicitudPrestamoByIdPrestamos: SolicitudPrestamos
        getSolicitudPrestamosUsuarioPrestamos: [SolicitudPrestamos]
        getSolicitudPrestamoByIdUsuarioPrestamos: SolicitudPrestamos
    }

    type Mutation{
        addUsuario(input: UsuarioInput): Response
        updUsuario(id: ID!, input: Usuarioinput): Response
        delUsuario(id: ID!): Response
        addPrestamo(input: PrestamoInput): Response
        updPrestamo(id: ID!, input: PrestamoInput): Response
        delPrestamo(id: ID!): Response
        addSolicitudPrestamo(id: ID!): Response
        updSolicitudPrestamo(id: ID!, input: SolicitudPrestamoInput): Response
        delSolicitudPrestamo(id: ID!): Response
    }

`;

const resolvers = {

    Query: {
        async getUsuarios(obj){
            const usuarios = await Usuario.find();
            return usuarios
        },

        async getUsuariosById(obj, {id}){
            const usuario = await Usuario.findById(id);
            return usuario;
        },

        async getUsuariosByRut(obj, {rut}){
            const usuario = await Usuario.find({rut: rut}).exec();
            return usuario;
        },

        async getPrestamos(obj){
            const prestamos = await Prestamo.find();
            return prestamos;
        },

        async getPrestamosEjemplar(obj){
            let prestamos = await Prestamo.find().populate('ejemplar');
            return prestamos;
        },

        async getPrestamoById(obj, {id}){
            let prestamo = await Prestamo.findById(id);
            return prestamo
        },

        async getPrestamoByIdEjemplar(obj, {id}){
            let prestamo = await Prestamo.findById(id).populate('ejemplar');
            return prestamo;
        },

        async getSolicitudPrestamos(obj){
            const solicitudPrestamos = await SolicitudPrestamo.find();
            return solicitudPrestamos;
        },

        async getSolicitudPrestamosUsuario(obj){
            const solicitudPrestamos = await SolicitudPrestamo.find().populate('usuario');
            return solicitudPrestamos;
        },

        async getSolicitudPrestamoById(obj, {id}){
            const solicitudPrestamo = await SolicitudPrestamo.findById(id);
            return solicitudPrestamo;
        },
        
        async getSolicitudPrestamoByIdUsuario(obj, {id}){
            let solicitudPrestamo = await SolicitudPrestamo.findById(id).populate('usuario');
            return solicitudPrestamo;
        },

        async getSolicitudPrestamosPrestamos(obj){
            let solicitudPrestamo = await SolicitudPrestamo.find().populate('prestamos');
            return solicitudPrestamo;
        },

        async getSolicitudPrestamoByIdPrestamo(obj, {id}){
            let solicitudPrestamo = await SolicitudPrestamo.findById(id).populate('prestamos');
            return solicitudPrestamo;
        },

        async  getSolicitudPrestamosUsuarioPrestamos(obj){
            let solicitudPrestamo = await SolicitudPrestamo.find().populate('usuario').populate('prestamos');
            return solicitudPrestamo;
        },
        
        async  getSolicitudPrestamoByIdUsuarioPrestamos(obj){
            let solicitudPrestamo = await SolicitudPrestamo.findById(id).populate('usuario').populate('prestamos');
            return solicitudPrestamo;
        },
    },
    
    Mutation: {

        async addUsuario(obj, {input}){
            const usuario = new Usuario(input);
            await usuario.save();
            return {
                statusCode: "200",
                body: null,
                errorCode: "0",
                descriptionError: ""
            };
        },

        async updUsuario(obj, {id, input}){
            const usuario = await Usuario.findByIdAndUpdate(id, input);
            return {
                statusCode: "200",
                body: usuario,
                errorCode: "0",
                descriptionError: ""
            };
        },

        async delUsuario(obj, {id}){
            await Usuario.deleteOne({_id: id});
            return {
                statusCode: "200",
                body: "Usuario Eliminado",
                errorCode: "0",
                descriptionError: ""
            };
        },

        async addPrestamo(obj, {input}){
            let ejemplarBus = await Ejemplar.findById(input.ejemplar);
            let prestamo = new Prestamo({tipoPrestamo: input.tipoPrestamo, ejemplar: ejemplarBus._id, fechaPrestamo: input.fechaPrestamo, fechaDevolucion: input.fechaDevolucion, fechaDevolucionReal: input.fechaDevolucionReal});
            await prestamo.save();
            return {
                statusCode: "200",
                body: null,
                errorCode: "0",
                descriptionError: ""
            };
        },

        async updPrestamo(obj, {id, input}){
            let ejemplarBus = await Ejemplar.findById(id);
            let prestamo = await Prestamo.findByIdAndUpdate({tipoPrestamo: input.tipoPrestamo, ejemplar: ejemplarBus._id, fechaPrestamo: input.fechaPrestamo, fechaDevolucion: input.fechaDevolucion, fechaDevolucionReal: input.fechaDevolucionReal});
            return {
                statusCode: "200",
                body: prestamo,
                errorCode: "0",
                descriptionError: ""
            };
        },

        async delPrestamo(obj, {id}){
            await Prestamo.deleteOne({_id: id});
            return {
                statusCode: "200",
                body: "Prestamo Eliminado",
                errorCode: "0",
                descriptionError: ""
            };
        },

        async addSolicitudPrestamo(obj, {input}){
            let ListaFinalPrestamos = []
            let ListaPrestamos = input.prestamos
            for (PrestamosObjectId in ListaPrestamos){
                let prestamo = await Prestamo.findById(PrestamosObjectId);
                ListaFinalPrestamos.push(prestamo._id)
            }

            let usuarioBus = await Usuario.findById(input.usuario);
            let solicitudPrestamo = new SolicitudPrestamo({usuario: usuarioBus._id, fechaSolicitud: input.fechaSolicitud, prestamos: ListaFinalPrestamos});
            await solicitudPrestamo.save();
            return {
                statusCode: "200",
                body: null,
                errorCode: "0",
                descriptionError: ""
            };
        },

        async updSolicitudPrestamo(obj, {input}){

            let ListaFinalPrestamos = []
            let ListaPrestamos = input.prestamos
            for (PrestamosObjectId in ListaPrestamos){
                let prestamo = await Prestamo.findById(PrestamosObjectId);
                ListaFinalPrestamos.push(prestamo._id)
            }

            let usuarioBus = await Usuario.findById(input.usuario);
            let solicitudPrestamo = await SolicitudPrestamo.findByIdAndUpdate({usuario: usuarioBus._id, fechaSolicitud: input.fechaSolicitud, prestamos: ListaFinalPrestamos});
            return {
                statusCode: "200",
                body: solicitudPrestamo,
                errorCode: "0",
                descriptionError: ""
            };
        },

        async delSolicitudPrestamo(obj, {id}){
            await SolicitudPrestamo.deleteOne({_id: id});
            return {
                statusCode: "200",
                body: "Prestamo Eliminado",
                errorCode: "0",
                descriptionError: ""
            };
        },

    }

}

let apolloServer = null;

const corsOptions = {
    origin: "htpp://localhost:8092",
    credentials: false
};

async function startServer() {
    apolloServer = new ApolloServer({typeDefs, resolvers, corsOptions});
    await apolloServer.start();

    apolloServer.applyMiddleware({app, cors: false});
}

startServer();

const app = express();
app.use(cors());
app.listen(8092, function(){
    console.log("Servidor Iniciado");
})