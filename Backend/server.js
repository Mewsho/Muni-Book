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
        solicitudPrestamo: SolicitudPrestamo
    }

    input DetalleSolicitudPrestamoInput{
        ejemplares: [Ejemplar]
        solicitudPrestamo: SolicitudPrestamo
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
        getDocumentos: [Documento]
        getDocumentoById(id: ID!) : Documento
        getEjemplares: [Ejemplar]
        getEjemplaresDocumento: [Ejemplar]
        getEjemplarById(id: ID!): Ejemplar
        getEjemplarByIdDocumento(id: ID!): Ejemplar
        getDetalleSolicitudPrestamos:[DetalleSolicitudPrestamo]
        getDetalleSolicitudPrestamosEjemplares:[DetalleSolicitudPrestamo]
        getDetalleSolicitudPrestamosSolicitudPrestamo: [DetalleSolicitudPrestamo]
        getDetalleSolicitudPrestamosEjemplaresSolicitudPrestamo:[DetalleSolicitudPrestamo]
        getDetalleSolicitudPrestamosById(id: ID!): DetalleSolicitudPrestamo
        getDetalleSolicitudPrestamosByIdEjemplares(id: ID!): DetalleSolicitudPrestamo
        getDetalleSolicitudPrestamosByIdSolicitudPrestamo(id: ID!): DetalleSolicitudPrestamo
        getDetalleSolicitudPrestamosByIdEjemplaresSolicitudPrestamo(id: ID!):DetalleSolicitudPrestamo
    }

    type Mutation{
        addDocumento(input: DocumentoInput): Response
        updDocumento(id: ID!, input: DocumentoInput): Response
        delDocumento(id: ID!): Response
        addEjemplar(input: EjemplarInput): Response
        updEjemplar(id: ID!, input: EjemplarInput): Response
        delEjemplar(id: ID!): Response
        addDetalleSolicitudPrestamo(input: DetalleSolicitudPrestamoInput): Response
        updDetalleSolicitudPrestamo(id: ID!, input: DetalleSolicitudPrestamoInput): Response
        delDetalleSolicitudPrestamo(id: ID!): Response
    }
`;

const resolvers = {

    Query: {
        async getDocumentos(obj){
            let documentos = await Documento.find();
            return documentos;
        },
        async getDocumentoById(obj, {id}){
            let documento = await Documento.findById(id);
            return documento;
        },

        async getEjemplares(obj){
            let ejemplares = await Ejemplar.find();
            return ejemplares;
        },
        async getEjemplaresDocumento(obj){
            let ejemplares = await Ejemplar.find().populate('documento');
            return ejemplares;
        },
        async getEjemplarById(obj, {id}) {
            let ejemplar = await Ejemplar.findById(id);
            return ejemplar;
        },
        async getEjemplarByIdDocumento(obj, {id}) {
            let ejemplar = await Ejemplar.findById(id).populate('documento');
            return ejemplar;
        },

        async getDetalleSolicitudPrestamos(obj){
            let detalleSolicitudPrestamos = await DetalleSolicitudPrestamo.find();
            return detalleSolicitudPrestamos;
        },
        async getDetalleSolicitudPrestamosEjemplares(obj){
            let detalleSolicitudPrestamos = await DetalleSolicitudPrestamo.find().populate('ejemplares');
            return detalleSolicitudPrestamos;
        },
        async getDetalleSolicitudPrestamosEjemplaresSolicitudPrestamo(obj){
            let detalleSolicitudPrestamos = await DetalleSolicitudPrestamo.find().populate('solicitudPrestamo');
            return detalleSolicitudPrestamos;
        },
        async getDetalleSolicitudPrestamosEjemplaresSolicitudPrestamo(obj){
            let detalleSolicitudPrestamos = await DetalleSolicitudPrestamo.find().populate('ejemplares').populate('solicitudPrestamo');
            return detalleSolicitudPrestamos;
        },
        async getDetalleSolicitudPrestamosById(obj, {id}){
            let detalleSolicitudPrestamo = await DetalleSolicitudPrestamo.findById(id);
            return detalleSolicitudPrestamo;
        },
        async getDetalleSolicitudPrestamosByIdEjemplares(obj, {id}){
            let detalleSolicitudPrestamos = await DetalleSolicitudPrestamo.findById(id).populate('ejemplares');
            return detalleSolicitudPrestamos;
        },
        async getDetalleSolicitudPrestamosByIdSolicitudPrestamo(obj, {id}){
            let detalleSolicitudPrestamos = await DetalleSolicitudPrestamo.findById(id).populate('solicitudPrestamo');
            return detalleSolicitudPrestamos;
        },
        async getDetalleSolicitudPrestamosByIdEjemplaresSolicitudPrestamo(obj, {id}){
            let detalleSolicitudPrestamos = await DetalleSolicitudPrestamo.findById(id).populate('ejemplares').populate('solicitudPrestamo');
            return detalleSolicitudPrestamos;
        }
    },
    
    Mutation: {

        async addDocumento(obj, {input}){
            let documento = new Documento(input);
            await documento.save();
            return {
                statusCode: "200",
                body: null,
                errorCode: "0",
                descriptionError: ""
            }
        },
        async updDocumento(obj, {id, input}){
            let documento = await Documento.findByIdAndUpdate(id, input);
            return {
                statusCode: "200",
                body: null,
                errorCode: "0",
                descriptionError: ""
            }
        },
        async delDocumento(obj, {id}){
            await Documento.deleteOne({_id: id});
            return {
                statusCode: "200",
                body: "Documento Eliminado",
                errorCode: "0",
                descriptionError: ""
            }
        },

        async addEjemplar(obj, {input}){
            let documentoBus = await Documento.findById(input.documento)
            let ejemplar = new Ejemplar({documento: documentoBus._id, estado: input.estado, ubicacion: input.ubicacion});
            await ejemplar.save();
            return {
                statusCode: "200",
                body: null,
                errorCode: "0",
                descriptionError: ""
            }
        },
        async updEjemplar(obj, {id, input}){
            let documentoBus = await Documento.findById(input.documento)
            let ejemplar = await Ejemplar.findByIdAndUpdate(id, {
                documento: documentoBus._id, estado: input.estado, ubicacion: input.ubicacion
            })
            return {
                statusCode: "200",
                body: null,
                errorCode: "0",
                descriptionError: ""
            }
        },
        async delEjemplar(obj, {id}){
            await Documento.deleteOne({_id: id});
            return {
                statusCode: "200",
                body: "Ejemplar Eliminado",
                errorCode: "0",
                descriptionError: ""
            }
        },

        async addDetalleSolicitudPrestamo(obj, {input}){
            
            let inputEjemplarList = []
            let ejemplarList = input.ejemplares
            for (ejemplarObjectId in ejemplarList){
                let ejemplar = await Ejemplar.findById(ejemplarObjectId);
                inputEjemplarList.push(ejemplar._id)
            }
            let solicitudPrestamoBus = await SolicitudPrestamo.findById(input.solicitudPrestamo);
            let detalleSolicitudPrestamo = new DetalleSolicitudPrestamo({
                ejemplares: inputEjemplarList, solicitudPrestamo: solicitudPrestamoBus._id
            })
            await detalleSolicitudPrestamo.save();
            return {
                statusCode: "200",
                body: null,
                errorCode: "0",
                descriptionError: ""
            };
        },
        async updDetalleSolicitudPrestamo(obj, {id, input}){
            let ejemplarIdFinalList = []
            let inputEjemplarList = input.ejemplares
            for (ejemplarObjectId in inputEjemplarList){
                let ejemplar = await Ejemplar.findById(ejemplarObjectId);
                ejemplarIdFinalList.push(ejemplar._id)
            }
            let solicitudPrestamoBus = await SolicitudPrestamo.findById(input.solicitudPrestamo);
            let detalleSolicitudPrestamo = await DetalleSolicitudPrestamo.findByIdAndUpdate(id,{
                ejemplares: ejemplarIdFinalList, solicitudPrestamo: solicitudPrestamoBus._id
            })
            return {
                statusCode: "200",
                body: null,
                errorCode: "0",
                descriptionError: ""
            };
        },
        async delDetalleSolicitudPrestamo(obj, {id}){
            await DetalleSolicitudPrestamo.deleteOne({_id: id});
            return {
                statusCode: "200",
                body: "DetalleSolicitudPrestamo Eliminado",
                errorCode: "0",
                descriptionError: ""
            }
        }

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