const express = require('express'); //Imortar librerias internas
const mongoose = require('mongoose');
const cors = require('cors');

const {ApolloServer, gql} = require('apollo-server-express'); //Importar librerias externas
const { GraphQLDateTime } = require('graphql-iso-date')


const DetalleSolicitudPrestamo = require('./models/detalleSolicitudPrestamo.js');
const Documento = require('./models/documento');
const Ejemplar = require('./models/ejemplar');
const Prestamo = require('./models/prestamo')
const SolicitudPrestamo = require('./models/solicitudPrestamo')
const Usuario = require('./models/usuario');


mongoose.connect('mongodb+srv://FcoTorres:hEqGLg4XvhwgO9y5@cluster0.45avn.mongodb.net/BaseBiblioteca',{useNewUrlParser: true, useUnifiedTopology:true});

const typeDefs = gql`

    scalar GraphQLDateTime

    type Usuario{
        id: ID!
        rut: Int!
        nombres: String!
        apellidos: String!
        direccion: String!
        telefono: Int!
        activo: Boolean!
        correo: String!
        password: String!
        tipoUsuario: Int!
    }

    input UsuarioInput{
        rut: Int!
        nombres: String!
        apellidos: String!
        direccion: String!
        telefono: Int!
        activo: Boolean!
        correo: String!
        password: String!
    }

    type Prestamo{
        id: ID!
        tipoPrestamo: String!
        ejemplar: Ejemplar!
        fechaPrestamo: GraphQLDateTime
        fechaDevolucion: GraphQLDateTime
        fechaDevolucionReal: GraphQLDateTime
    }

    input PrestamoInput{
        tipoPrestamo: String!
        ejemplar: String
        fechaPrestamo: GraphQLDateTime
        fechaDevolucion: GraphQLDateTime
        fechaDevolucionReal: GraphQLDateTime
    }

    # Hay tres estados Disponible, En sala y No disponible (2,1,0)
    type Ejemplar{
        id: ID!
        documento: Documento
        estado: Int! 
        estadoTexto: String!
        ubicacion: String!
    }

    input EjemplarInput{
        documento: String,
        estado: Int!
        estadoTexto: String!
        ubicacion: String!
    }

    type Documento{
        id: ID!
        tipo: String!
        titulo: String!
        autor: String!
        editorial: String!
        anio: Int!
        edicion: Int!
        categoria: String!
        tipoFisico: String!
    }

    input DocumentoInput{
        tipo: String!
        titulo: String!
        autor: String!
        editorial: String!
        anio: Int!
        edicion: Int!
        categoria: String!
        tipoFisico: String!
    }

    type DetalleSolicitudPrestamo{
        id: ID!
        ejemplares: [Ejemplar]
        solicitudPrestamo: SolicitudPrestamo
    }

    input DetalleSolicitudPrestamoInput{
        ejemplares: [String]
        solicitudPrestamo: String
    }

    type SolicitudPrestamo{
        id: ID!
        usuario: Usuario
        fechaSolicitud: GraphQLDateTime!
        prestamos: [Prestamo]
        esReserva: Boolean

    }

    input SolicitudPrestamoInput{
        usuario: String
        fechaSolicitud: GraphQLDateTime!
        prestamos: [String]
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
        # Query basicos de cada cosa
        getUsuarios: [Usuario]
        getUsuarioById(id: ID!): Usuario
        getUsuarioByRut(rut: Int!): Usuario
        getPrestamos: [Prestamo]
        getPrestamosEjemplar: [Prestamo]
        getPrestamoById(id: ID!): Prestamo
        getPrestamoByIdEjemplar(id: ID!): Prestamo
        getSolicitudPrestamos: [SolicitudPrestamo]
        getSolicitudPrestamosUsuario: [SolicitudPrestamo]
        getSolicitudPrestamoById(id: ID!): SolicitudPrestamo
        getSolicitudPrestamoByIdUsuario(id: ID!): SolicitudPrestamo
        getSolicitudPrestamosPrestamos: [SolicitudPrestamo]
        getSolicitudPrestamoByIdPrestamos: SolicitudPrestamo
        getSolicitudPrestamosUsuarioPrestamos: [SolicitudPrestamo]
        getSolicitudPrestamoByIdUsuarioPrestamos: SolicitudPrestamo
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
        # Query especiales
        getEjemplaresByDocumentoAndEstado(documentoId: ID!, estado: Int): [Ejemplar]
    }

    type Mutation{
        addUsuario(input: UsuarioInput): Response
        updUsuario(id: ID!, input: UsuarioInput): Response
        delUsuario(id: ID!): Response
        addPrestamo(input: PrestamoInput): Response
        updPrestamo(id: ID!, input: PrestamoInput): Response
        delPrestamo(id: ID!): Response
        addSolicitudPrestamo(id: ID!): Response
        updSolicitudPrestamo(id: ID!, input: SolicitudPrestamoInput): Response
        delSolicitudPrestamo(id: ID!): Response
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
        async getUsuarios(obj){
            const usuarios = await Usuario.find();
            return usuarios
        },

        async getUsuarioById(obj, {id}){
            const usuario = await Usuario.findById(id);
            return usuario;
        },

        async getUsuarioByRut(obj, {rut}){
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

        async getSolicitudPrestamoByIdPrestamos(obj, {id}){
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
        },

        // Query especiales

        async getEjemplaresByDocumentoAndEstado(obj, {documentoId, estado}){
            let checkEstado = estado
            let docId = documentoId
            let ejemplares = await Ejemplar.find(
                {documento: docId, estado: checkEstado}
            )
            return ejemplares
        }

    },
    
    Mutation: {

        async addUsuario(obj, {input}){
            const usuario = new Usuario(input);
            await usuario.save();
        },

        async updUsuario(obj, {id, input}){
            const usuario = await Usuario.findByIdAndUpdate(id, input);
            return {
                statusCode: "200",
                body: null,
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
            let ejemplarBus = await Ejemplar.findById(input.ejemplar);
            let prestamo = await Prestamo.findByIdAndUpdate(id, {tipoPrestamo: input.tipoPrestamo, ejemplar: ejemplarBus._id, fechaPrestamo: input.fechaPrestamo, fechaDevolucion: input.fechaDevolucion, fechaDevolucionReal: input.fechaDevolucionReal});
            return {
                statusCode: "200",
                body: null,
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


        async addDocumento(obj, {input}){
            let result = await checkDocumentos(input);
            if (!result[0]){
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "0",
                    descriptionError: `${result[1]} no valido`
                };
            };
            let documento = new Documento(input);
            await documento.save();
            return {
                statusCode: "200",
                body: null,
                errorCode: "0",
                descriptionError: ""
            };
        },

        async updDocumento(obj, {id, input}){
            let result = await checkDocumentos(input);
            if (!result[0]){
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "0",
                    descriptionError: `${result[1]} no valido`
                };
            };
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
            if (documentoBus == null){
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "0",
                    descriptionError: "Documento no encontrado"
                }
            }
            let check = await checkEjemplares(input)
            if (!check[0]){
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "0",
                    descriptionError: `${check[1]} no valido`
                };
            };
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
            if (documentoBus == null){
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "0",
                    descriptionError: "Id Erroneo"
                }
            }
            let check = await checkEjemplares(input)
            if (!check[0]){
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "0",
                    descriptionError: `${check[1]} no valido`
                }
            }
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
                if (ejemplar == null){
                    return {
                        statusCode: "400",
                        body: null,
                        errorCode: "0",
                        descriptionError: "Ejemplar no encontrado"
                    }
                }
                inputEjemplarList.push(ejemplar._id)
            }
            let solicitudPrestamoBus = await SolicitudPrestamo.findById(input.solicitudPrestamo);
            if (solicitudPrestamoBus == null){
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "0",
                    descriptionError: "SolicitudPrestamo no encontrado"
                }
            }
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
                if (ejemplar == null){
                    return {
                        statusCode: "400",
                        body: null,
                        errorCode: "0",
                        descriptionError: "Ejemplar no encontrado"
                    }
                }
                ejemplarIdFinalList.push(ejemplar._id)
            }
            let solicitudPrestamoBus = await SolicitudPrestamo.findById(input.solicitudPrestamo);
            if (solicitudPrestamoBus == null){
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "0",
                    descriptionError: "SolicitudPrestamo no encontrado"
                }
            }
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
            let solicitudPrestamo = await SolicitudPrestamo.findByIdAndUpdate(id, {usuario: usuarioBus._id, fechaSolicitud: input.fechaSolicitud, prestamos: ListaFinalPrestamos});
            return {
                sstatusCode: "200",
                body: null,
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

async function checkDocumentos(input){
    let ListTipos = ["Libro","Multimedia"];
    if (input.anio >= 2100 || input.anio <= -100){
        return [false,"Anio"];
    };
    if (input.edicion < 0){
        return [false, "Edicion"]
    };
    if (!ListTipos.includes(input.tipo)){
        return [false, "Tipo"]
    };
    if (input.titulo.length > 100){
        return [false, "Titulo"]
    };
    if (input.autor.length > 100){
        return [false, "Autor"]
    }
    return [true,""]
}

async function checkEjemplares(input) {
    let ListEstados = ["Disponible","En sala", "No disponible"];
    if (input.estado < 0 || input.estado > 5){
        return [false, "Estado"];
    };
    if (!ListEstados.includes(input.estadoTexto)){
        return [false, "EstadoTexto"]
    };
    return [true,""]
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