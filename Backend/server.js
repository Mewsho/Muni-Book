const express = require('express'); //Imortar librerias internas
const mongoose = require('mongoose');
const cors = require('cors');

const {ApolloServer, gql} = require('apollo-server-express'); //Importar librerias externas
const { GraphQLDateTime } = require('graphql-iso-date')
const cron = require('node-cron')

const DetalleSolicitudPrestamo = require('./models/detalleSolicitudPrestamo.js');
const Documento = require('./models/documento');
const Ejemplar = require('./models/ejemplar.js');
const Prestamo = require('./models/prestamo')
const SolicitudPrestamo = require('./models/solicitudPrestamo')
const Usuario = require('./models/usuario');
const TipoDocumento = require('./models/tipoDocumento');
const CategoriaDocumento = require('./models/categoriaDocumento');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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
        codigo: Int #Codigo 0 = activo
        correo: String!
        password: String!
        tipoUsuario: Int! # 0: usuario 1: bibliotecario 2: admin
        fechaSancion: GraphQLDateTime
    }

    input UsuarioInput{
        rut: Int!
        nombres: String!
        apellidos: String!
        direccion: String!
        telefono: Int!
        activo: Boolean!
        codigo: Int
        correo: String!
        password: String!
        tipoUsuario: Int! 
        fechaSancion: GraphQLDateTime
    }

    type Prestamo{
        id: ID!
        tipoPrestamo: String! #  Sala, Domicilio, Reserva, 0,1,2
        ejemplar: Ejemplar! 
        fechaPrestamo: GraphQLDateTime
        fechaDevolucion: GraphQLDateTime
        fechaDevolucionReal: GraphQLDateTime
    }

    input PrestamoInput{
        tipoPrestamo: String
        ejemplar: String
        fechaPrestamo: GraphQLDateTime
        fechaDevolucion: GraphQLDateTime
        fechaDevolucionReal: GraphQLDateTime
    }

    # Hay cuatro estados Disponible, En sala, Reserva y  No disponible (3,2,1,0)
    type Ejemplar{
        id: ID!
        codigo: Int!
        estado: Int! 
        estadoTexto: String!
        ubicacion: String!
        documento: Documento
    }

    input EjemplarInput{
        codigo: Int
        estado: Int
        estadoTexto: String
        ubicacion: String
        documento: String
    }

    type Documento{
        id: ID!
        titulo: String!
        autor: String!
        editorial: String!
        anioSalida: Int!
        edicion: Int!
        codigo: String
        tipoDocumento: TipoDocumento
        categoriaDocumento: [CategoriaDocumento]
    }
    input DocumentoInput{
        titulo: String!
        autor: String!
        editorial: String!
        anioSalida: Int!
        edicion: Int!
        codigo: String
        tipoDocumento: String
        categoriaDocumento: [String]
    }

    type TipoDocumento{
        id: ID!
        tipo: String
    }
    input TipoDocumentoInput{
        tipo: String
    }

    type CategoriaDocumento{
        id: ID!
        categoria: String
    }
    input CategoriaDocumentoInput{
        categoria: String
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
        tipoSolicitud: String # Sala, Domicilio, Reserva, 0,1,2
        estadoSolicitud: Int # Aprobado y No Aprobado 
        fechaSolicitud: GraphQLDateTime
        usuario: Usuario
        prestamos: [Prestamo]
    }
    input SolicitudPrestamoInput{
        tipoSolicitud: String
        estadoSolicitud: Int
        fechaSolicitud: GraphQLDateTime
        usuario: String
        prestamos: [String]
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

    type RespuestaLogin{
        respuesta: Int
        usuario: Usuario
    }

    type Query{
        # Query basicos de cada cosa
        getUsuarios: [Usuario]
        getUsuarioById(id: ID!): Usuario
        getUsuarioByCorreo(correo: String!): Usuario
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
        getSolicitudPrestamoByIdPrestamos(id: ID!): SolicitudPrestamo
        getSolicitudPrestamosUsuarioPrestamos: [SolicitudPrestamo]
        getSolicitudPrestamoByIdUsuarioPrestamos(id: ID!): SolicitudPrestamo
        getDocumentos: [Documento]
        getDocumentosTipo: [Documento]
        getDocumentosCategoria: [Documento]
        getDocumentosTipoCategoria: [Documento]
        getDocumentoById(id: ID!) : Documento
        getDocumentosByIdTipo(id: ID!): Documento
        getDocumentosByIdCategoria(id: ID!): Documento
        getDocumentosByIdTipoCategoria(id: ID!): Documento
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
        getTipoDocumentos: [TipoDocumento]
        getTipoDocumentoById(id: ID!): TipoDocumento
        getCategoriaDocumentos: [CategoriaDocumento]
        getCategoriaDocumentosById(id: ID!): CategoriaDocumento
        getCategoriaDocumentosByIdTipoDocumento(id: ID!): CategoriaDocumento
        # Query especiales
        getEjemplaresByDocumentoAndEstado(documentoId: ID!, estado: Int): [Ejemplar]
        getCantEjemplaresByDocumentoAndEstado(documentoId: ID!, estado: Int): Int
        getDocumentosByTituloAndAutorAndTipoAndCategoria(tipoId: ID, categoriaId: ID, titulo: String, autor: String): [Documento]
        getNDocumentos(numero: Int): [Documento]
        getUsuarioByCorreoAndCheckPassword(correo: String!, password: String!): Usuario
        sendEmail(correo: String, codigoVerificador: Int, nombres: String): Boolean
        getNEjemplaresDisponiblesByDocumentId(documentoId: ID, cantEjemplares: Int): [Ejemplar]
        getSolicitudPrestamoByUsuarioId(usuarioID: ID!): SolicitudPrestamo
        getPrestamoByEjemplarId(ejemplarID: ID!): Prestamo
        getSolicitudPrestamoUsuarioByPrestamoId(prestamoID: ID!): SolicitudPrestamo
    }

    type Mutation{
        addUsuario(input: UsuarioInput): Response
        updUsuario(id: ID!, input: UsuarioInput): Response
        delUsuario(id: ID!): Response
        addPrestamo(input: PrestamoInput): Prestamo
        updPrestamo(id: ID!, input: PrestamoInput): Response
        delPrestamo(id: ID!): Response
        addSolicitudPrestamo(input: SolicitudPrestamoInput): SolicitudPrestamo
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
        addTipoDocumento(input: TipoDocumentoInput): Response
        updTipoDocumento(id: ID!, input: TipoDocumentoInput): Response
        delTipoDocumento(id: ID!): Response
        addCategoriaDocumento(input: CategoriaDocumentoInput): Response
        updCategoriaDocumento(id: ID!, input: CategoriaDocumentoInput): Response
        delCategoriaDocumento(id: ID!): Response
        ScheduleUpdEjemplar(id: ID, input: EjemplarInput, minutos: Int): Response
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
            const usuario = await Usuario.findOne({rut: rut});
            return usuario;
        },

        async getUsuarioByCorreo(obj, {correo}){
            const usuario = await Usuario.findOne({correo: correo});
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

        async getDocumentosTipo(obj){
            let documentos = await Documento.find().populate('tipoDocumento');
            return documentos;
        },

        async getDocumentosCategoria(obj){
            let documentos = await Documento.find().populate('categoriaDocumento');
            return documentos;
        },

        async getDocumentosTipoCategoria(obj){
            let documentos = await Documento.find().populate('tipoDocumento').populate('categoriaDocumento');
            return documentos;
        },

        async getDocumentoById(obj, {id}){
            let documento = await Documento.findById(id);
            return documento;
        },

        async getDocumentosByIdTipo(obj, {id}){
            let documentos = await Documento.findById(id).populate('tipoDocumento');
            return documentos;
        },

        async getDocumentosByIdCategoria(obj, {id}){
            let documentos = await Documento.findById(id).populate('categoriaDocumento');
            return documentos;
        },

        async getDocumentosByIdTipoCategoria(obj, {id}){
            let documentos = await Documento.findById(id).populate('tipoDocumento').populate('categoriaDocumento');
            return documentos;
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

        async getTipoDocumentos(obj){
            let tipoDocumentos = await TipoDocumento.find();
            return tipoDocumentos;
        },

        async getTipoDocumentoById(obj, {id}){
            let tipoDocumento = await TipoDocumento.findById(id);
            return tipoDocumento;
        },

        async getCategoriaDocumentos(obj){
            let categoriaDocumentos = await CategoriaDocumento.find();
            return categoriaDocumentos;
        },

        async getCategoriaDocumentosById(obj, {id}){
            let categoriaDocumento = await CategoriaDocumento.findById(id);
            return categoriaDocumento;
        },

        async getCategoriaDocumentosByIdTipoDocumento(obj, {id}){
            let ejemplar = await Ejemplar.findById(id).populate('tipoDocumento');
            return ejemplar;
        },

        // Query especiales

        async getEjemplaresByDocumentoAndEstado(obj, {documentoId, estado}){
            let checkEstado = estado
            let docId = documentoId
            let ejemplares = await Ejemplar.find(
                {documento: docId, estado: checkEstado}
            )
            return ejemplares
        },

        async getCantEjemplaresByDocumentoAndEstado(obj, {documentoId, estado}){
            let checkEstado = estado
            let docId = documentoId
            let Ejemplares = await Ejemplar.find(
                {documento: docId, estado: checkEstado}
            )
            cantidadEjemplares = Ejemplares.length
            return cantidadEjemplares
        },

            // Todo esto del regex es algo similar a hacer queries con un like en sql
            // en especifico utiliza un sistema llamado regular expression que es mas brijido 
            // lo que tengo puesto es una implementacion simple que talvez funciona xd
        async getDocumentosByTituloAndAutorAndTipoAndCategoria(obj, {tipoId, categoriaId, titulo, autor}){
            
            if (titulo == null){
                titulo = ""
            }
            if (autor == null){
                autor = ""
            }
            if (tipoId == null && categoriaId == null){
                let documentos = await Documento.find({
                    titulo: {'$regex': titulo, '$options': 'i'}, 
                    autor: {'$regex': autor, '$options': 'i'}
                }).populate('tipoDocumento').populate('categoriaDocumento')
                return documentos
            }
            if (tipoId == null){
                let documentos = await Documento.find({
                    titulo: {'$regex': titulo, '$options': 'i'}, 
                    autor: {'$regex': autor, '$options': 'i'}, categoriaDocumento: { $in: [categoriaId]}
                }).populate('tipoDocumento').populate('categoriaDocumento')  
                return documentos  
            }
            if (categoriaId == null){
                let documentos = await Documento.find({
                    titulo: {'$regex': titulo, '$options': 'i'}, 
                    autor: {'$regex': autor, '$options': 'i'}, tipoDocumento: tipoId
                }).populate('tipoDocumento').populate('categoriaDocumento')
                return documentos
            }
            let documentos = await Documento.find({
                titulo: {'$regex': titulo, '$options': 'i'}, 
                autor: {'$regex': autor, '$options': 'i'}, tipoDocumento: tipoId, categoriaDocumento: { $in: [categoriaId]}
            }).populate('tipoDocumento').populate('categoriaDocumento')
            return documentos
        },

        async getNDocumentos(obj, {numero}){
            let documentos = await Documento.find().populate('tipoDocumento').populate('categoriaDocumento').limit(numero)
            return documentos
        },

        async getUsuarioByCorreoAndCheckPassword(obj, {correo, password}){
            let usuario = await Usuario.findOne({correo: correo})
            if (usuario == null){
                return null
            }
            let contraUsuario = usuario.password
            if (contraUsuario != password){
                return null
            }

            if (contraUsuario == password){
                return usuario
            }
        },

        async sendEmail(obj, {correo, codigoVerificador, nombres}){
            const Mailjet = require('node-mailjet');
            const mailjet = new Mailjet({
                apiKey: "2c2311d2a5452193e53069707de1828f" || 'your-api-key',
                apiSecret: "4022789f5d17acc380dc7268152888bd" || 'your-api-secret'
            });

            try {
                const request = await mailjet.post('send', { version: 'v3.1' }).request({
                    Messages: [
                        {
                            From: {
                                Email: 'fco.torres01@gmail.com',
                                Name: 'Me',
                            },
                            To: [
                                {
                                    Email: correo,
                                    Name: 'You',
                                },
                            ],
                            Subject: 'Codigo de Confirmación',
                            TextPart: 'Confirmación MuniBook',
                            HTMLPart:
                                `<h3>Hola ${nombres}</h3><br />Bienvenido a Munibook, para completar la creación de tu cuenta, por favor usa el codigo de abajo:<br /><h2>${codigoVerificador}</h2><br />Por favor, ingresa el codigo en la siguiente <a href="ConfirmarCodigo.html">pagina</a><br />Gracias por registrarte a Munibook!`,
                        },
                    ],
                });
                console.log(request.body);
            } catch (err) {
                console.error(`Error: ${err.message} - Código de estado: ${err.statusCode}`);
            }
        },

        async getNEjemplaresDisponiblesByDocumentId(obj, {documentoId, cantEjemplares}){
            let Ejemplares = await Ejemplar.find({
                documento: documentoId,
                estadoTexto: "Disponible",
                estado: 3
            }).limit(cantEjemplares)
            return Ejemplares
        },
          
        async getSolicitudPrestamoByUsuarioId(obj, {usuarioID}){
            let solicitudPrestamo = await SolicitudPrestamo.findOne({usuario: usuarioID}).populate('prestamos');
            return solicitudPrestamo;
        },

        async getPrestamoByEjemplarId(obj, {ejemplarID}){
            let prestamo = await Prestamo.findOne({ejemplar: ejemplarID}).populate('ejemplar')
            return prestamo;
        },


        async getSolicitudPrestamoUsuarioByPrestamoId(obj, {prestamoID}){
            let solicitudPrestamo = await SolicitudPrestamo.findOne({prestamos: { $in: [prestamoID]}}).populate('usuario').populate('prestamos')
            return solicitudPrestamo;
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
            return prestamo;
        },

        async updPrestamo(obj, {id, input}){
            let ejemplarBus = await Ejemplar.findOne({_id: input.ejemplar});
            let inputPrestamo
            if (ejemplarBus == null){
                inputPrestamo = {
                    tipoPrestamo: input.tipoPrestamo, 
                    fechaPrestamo: input.fechaPrestamo, 
                    fechaDevolucion: input.fechaDevolucion, 
                    fechaDevolucionReal: input.fechaDevolucionReal
                }
            }
            else{
                inputPrestamo = {
                    tipoPrestamo: input.tipoPrestamo, 
                    ejemplar: ejemplarBus._id, fechaPrestamo: input.fechaPrestamo, 
                    fechaDevolucion: input.fechaDevolucion, 
                    fechaDevolucionReal: input.fechaDevolucionReal
                }
            }
            let prestamo = await Prestamo.findByIdAndUpdate(id, inputPrestamo);
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
            let tipoDocumentoBus = await TipoDocumento.findById(input.tipoDocumento);
            if (tipoDocumentoBus == null){
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "0",
                    descriptionError: "Tipo no encontrado"
                }
            }

            let inputCategoriasList = []
            let categoriasList = input.categoriaDocumento
            for (const categoriaObjectId of categoriasList){
                console.log(categoriaObjectId)
                let categoria = await CategoriaDocumento.findById(categoriaObjectId);
                console.log(categoria)
                if (categoria == null){
                    return {
                        statusCode: "400",
                        body: null,
                        errorCode: "0",
                        descriptionError: "Categoria no encontrado"
                    }
                }
                inputCategoriasList.push(categoria._id)
            }
            let documento = new Documento({
                titulo: input.titulo, autor: input.autor, editorial: input.editorial,
                anioSalida: input.anioSalida, edicion: input.edicion, codigo: input.codigo,
                tipoDocumento: tipoDocumentoBus._id, categoriaDocumento: inputCategoriasList
            });
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
            let tipoDocumentoBus = await TipoDocumento.findById(input.tipoDocumento);
            if (tipoDocumentoBus == null){
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "0",
                    descriptionError: "Tipo no encontrado"
                }
            }
            let inputCategoriasList = []
            let categoriasList = input.categoriaDocumento
            for (const categoriaObjectId of categoriasList){
                console.log(categoriaObjectId)
                let categoria = await CategoriaDocumento.findById(categoriaObjectId);
                console.log(categoria)
                if (categoria == null){
                    return {
                        statusCode: "400",
                        body: null,
                        errorCode: "0",
                        descriptionError: "Categoria no encontrado"
                    }
                }
                inputCategoriasList.push(categoria._id)
            }
            let documento = await Documento.findByIdAndUpdate(id, {
                titulo: input.titulo, autor: input.autor, editorial: input.editorial,
                anioSalida: input.anioSalida, edicion: input.edicion, codigo: input.codigo,
                tipoDocumento: tipoDocumentoBus._id, categoriaDocumento: inputCategoriasList
            });
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
            let ejemplar = new Ejemplar({
                documento: documentoBus._id, estado: input.estado, 
                ubicacion: input.ubicacion, estadoTexto: input.estadoTexto, codigo: input.codigo});
            await ejemplar.save();
            return {
                statusCode: "200",
                body: null,
                errorCode: "0",
                descriptionError: ""
            }
        },

        async updEjemplar(obj, {id, input}){
            let documentoBus = await Documento.findOne({_id: input.documento})
            let inputEjemplar
            if (documentoBus == null){
                inputEjemplar = {
                    estado: input.estado, 
                    ubicacion: input.ubicacion, estadoTexto: input.estadoTexto, 
                    codigo: input.codigo
                }
            }
            else{
                inputEjemplar = {
                    documento: documentoBus._id, estado: input.estado, 
                    ubicacion: input.ubicacion, estadoTexto: input.estadoTexto, 
                    codigo: input.codigo
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
            let ejemplar = await Ejemplar.findByIdAndUpdate(id, 
                inputEjemplar
            )
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
            for (ejemplarObjectId of ejemplarList){
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
            for (PrestamosObjectId of ListaPrestamos){
                let prestamo = await Prestamo.findById(PrestamosObjectId);
                ListaFinalPrestamos.push(prestamo._id)
            }
            let usuarioBus = await Usuario.findById(input.usuario);
            let solicitudPrestamo = new SolicitudPrestamo({
                usuario: usuarioBus._id, fechaSolicitud: input.fechaSolicitud, 
                prestamos: ListaFinalPrestamos, tipoSolicitud: input.tipoSolicitud,
                estadoSolicitud: input.estadoSolicitud
            });
            await solicitudPrestamo.save();
            return solicitudPrestamo;
        },
        

        async updSolicitudPrestamo(obj, {id, input}){
            let ListaFinalPrestamos = []
            let ListaPrestamos = input.prestamos
            if (ListaPrestamos != null){
                for (PrestamosObjectId of ListaPrestamos){
                    let prestamo = await Prestamo.findOne({_id: PrestamosObjectId});
                    ListaFinalPrestamos.push(prestamo._id)
                }
            }
            let usuarioBus = await Usuario.findOne({_id: input.usuario});
            let inputSolicitud
            if(ListaFinalPrestamos.length == 0 && usuarioBus == null){
                inputSolicitud = {
                    fechaSolicitud: input.fechaSolicitud, 
                    tipoSolicitud: input.tipoSolicitud,
                    estadoSolicitud: input.estadoSolicitud
                }
            }
            else if(usuarioBus == null){
                inputSolicitud = {
                    fechaSolicitud: input.fechaSolicitud, 
                    prestamos: ListaFinalPrestamos, tipoSolicitud: input.tipoSolicitud,
                    estadoSolicitud: input.estadoSolicitud
                }
            }
            else if(ListaFinalPrestamos.length == 0){
                inputSolicitud = {
                    usuario: usuarioBus._id, fechaSolicitud: input.fechaSolicitud, 
                    tipoSolicitud: input.tipoSolicitud,
                    estadoSolicitud: input.estadoSolicitud
                }
            }
            else{
                inputSolicitud = {
                    usuario: usuarioBus._id, fechaSolicitud: input.fechaSolicitud, 
                    prestamos: ListaFinalPrestamos, tipoSolicitud: input.tipoSolicitud,
                    estadoSolicitud: input.estadoSolicitud
                }
            }

            let solicitudPrestamo = await SolicitudPrestamo.findByIdAndUpdate(id, inputSolicitud);
            return {
                statusCode: "200",
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
        

        async addTipoDocumento(obj, {input}){
            let tipoDocumento = new TipoDocumento(input)
            await tipoDocumento.save()
            return {
                statusCode: "200",
                body: "TipoDocumento Agregado",
                errorCode: "0",
                descriptionError: ""
            };
        },

        async updTipoDocumento(obj, {input}){
            let tipoDocumento = await TipoDocumento.findByIdAndUpdate(id, input)
            await tipoDocumento.save()
            return {
                statusCode: "200",
                body: "TipoDocumento actualizado",
                errorCode: "0",
                descriptionError: ""
            };
        },

        async delTipoDocumento(obj, {input}){
            await TipoDocumento.deleteOne({_id: id});
            return {
                statusCode: "200",
                body: "CategoriaDocumento Eliminado",
                errorCode: "0",
                descriptionError: ""
            };
        },

        async addCategoriaDocumento(obj, {input}){
            let categoriaDocumento = new CategoriaDocumento(input)
            await categoriaDocumento.save()
            return {
                statusCode: "200",
                body: "CategoriaDocumento Agregado",
                errorCode: "0",
                descriptionError: ""
            };
        },

        async updCategoriaDocumento(obj, {input}){
            let categoriaDocumento = await CategoriaDocumento.findByIdAndUpdate(id, input)
            return {
                statusCode: "200",
                body: "CategoriaDocumento Actualizado",
                errorCode: "0",
                descriptionError: ""
            };
        },

        async delCategoriaDocumento(obj, {id}){
            await CategoriaDocumento.deleteOne({_id: id});
            return {
                statusCode: "200",
                body: "CategoriaDocumento Eliminado",
                errorCode: "0",
                descriptionError: ""
            };
        },

        async ScheduleUpdEjemplar(obj, {id, input, minutos}){

            let strCron = `*/${minutos} * * * *`
            let cronCnt = 0
            let task = cron.schedule(strCron, () =>  {
                cambiarEjemplar(id,input)

                cronCnt+=1
            },{
                scheduled: false
            });

            (async () => {
                task.start()
                while (true) {
                  if (cronCnt < 1) {
                    await sleep(2000); 
                  } else {
                    task.stop(); 
                    break;
                  }
                }
            })()


            return {
                statusCode: "200",
                body: "Scheduled Iniciada",
                errorCode: "0",
                descriptionError: ""
            };
        }

    }
}


async function cambiarEjemplar(id, input){
    let ejemplar = await Ejemplar.findByIdAndUpdate(id, input)
    console.log("Actualizado")
}

async function checkDocumentos(input){
    if (input.anioSalida >= 2100 || input.anioSalida <= -100){
        return [false,"Anio"];
    };
    if (input.edicion < 0){
        return [false, "Edicion"]
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
    let ListEstados = ["Disponible","En sala", "Reserva", "No disponible"];
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
    origin: "http://localhost:8092",
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


/*
const Mailjet = require('node-mailjet');


const mailjet = new Mailjet({
    apiKey: "2c2311d2a5452193e53069707de1828f" || 'your-api-key',
    apiSecret: "4022789f5d17acc380dc7268152888bd" || 'your-api-secret'
});


const mailjetApi = Mailjet.apiConnect(
    "2c2311d2a5452193e53069707de1828f",
    "4022789f5d17acc380dc7268152888bd",
    {
      config: {},
      options: {}
    } 
);


// El mailjet.post manda el correo


function sendMail(){
    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'fco.torres01@gmail.com',
              Name: 'Me',
            },
            To: [
              {
                Email: 'eliamrivas016@gmail.com',
                Name: 'You',
              },
            ],
            Subject: 'My first Mailjet Email!',
            TextPart: 'Greetings from Mailjet!',
            HTMLPart:
              '<h3>Dear passenger 1, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the delivery force be with you!',
          },
        ],
    })
    
    request
        .then(result => {
          console.log(result.body)
        })
        .catch(err => {
          console.log(err.statusCode)
        })    
}
*/