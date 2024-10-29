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
const TipoDocumento = require('./models/tipoDocumento');
const CategoriaDocumento = require('./models/categoriaDocumento');


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
        correo: String!
        password: String!
        tipoUsuario: Int! 
        fechaSancion: GraphQLDateTime
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
        codigo: Int!
        estado: Int!
        estadoTexto: String!
        ubicacion: String!
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
        categoriaDocumento: CategoriaDocumento
    }
    input DocumentoInput{
        titulo: String!
        autor: String!
        editorial: String!
        anioSalida: Int!
        edicion: Int!
        codigo: String
        tipoDocumento: String
        categoriaDocumento: String
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
        tipoSolicitud: Int # Sala, domicilio, reserva
        estadoSolicitud: Int # Aprobado y no aprobado 
        fechaSolicitud: GraphQLDateTime
        usuario: Usuario
        prestamos: [Prestamo]
    }
    input SolicitudPrestamoInput{
        tipoSolicitud: Int
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
        getSolicitudPrestamoByIdPrestamos: SolicitudPrestamo
        getSolicitudPrestamosUsuarioPrestamos: [SolicitudPrestamo]
        getSolicitudPrestamoByIdUsuarioPrestamos: SolicitudPrestamo
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
        getDocumentosByTituloAndAutorAndTipoAndCategoria(titulo: String, autor: String, tipoId: ID, categoriaId: ID): [Documento]
        getNDocumentos(numero: Int): [Documento]
        getUsuarioByCorreoAndCheckPassword(correo: String!, password: String!): Usuario
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
        addTipoDocumento(input: TipoDocumentoInput): Response
        updTipoDocumento(id: ID!, input: TipoDocumentoInput): Response
        delTipoDocumento(id: ID!): Response
        addCategoriaDocumento(input: CategoriaDocumentoInput): Response
        updCategoriaDocumento(id: ID!, input: CategoriaDocumentoInput): Response
        delCategoriaDocumento(id: ID!): Response
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

        async getUsuarioByCorreo(obj, {correo}){
            const usuario = await Usuario.find({correo: correo}).exec();
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
            let cantidadEjemplares = await Ejemplar.find(
                {documento: docId, estado: checkEstado}
            ).count()
            return cantidadEjemplares
        },

            // Todo esto del regex es algo similar a hacer queries con un like en sql
            // en especifico utiliza un sistema llamado regular expression que es mas brijido 
            // lo que tengo puesto es una implementacion simple que talvez funciona xd
        async getDocumentosByTituloAndAutorAndTipoAndCategoria(obj, {titulo, autor, tipo, categoria}){
            let tipoId = tipo
            let categoriaId = categoria
            if (tipoId == null){
                let documentos = await Documento.find({
                    titulo: {'$regex': titulo, '$options': 'i'}, 
                    autor: {'$regex': autor, '$options': 'i'}, categoria: categoriaId
                })  
                return documentos  
            }
            if (categoriaId == null){
                let documentos = await Documento.find({
                    titulo: {'$regex': titulo, '$options': 'i'}, 
                    autor: {'$regex': autor, '$options': 'i'}, tipo: tipoId
                })
                return documentos
            }
            let documentos = await Documento.find({
                titulo: {'$regex': titulo, '$options': 'i'}, 
                autor: {'$regex': autor, '$options': 'i'}, tipo: tipoId, categoria: categoriaId
            })
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
            let tipoDocumentoBus = await TipoDocumento.findById(input.tipoDocumento);
            if (tipoDocumentoBus == null){
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "0",
                    descriptionError: "Tipo no encontrado"
                }
            }
            let categoriaDocumentoBus = await CategoriaDocumento.findById(input.categoriaDocumento);
            if (categoriaDocumentoBus == null){
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "0",
                    descriptionError: "Categoreia no encontrada"
                }
            }
            let documento = new Documento({
                titulo: input.titulo, autor: input.autor, editorial: input.editorial,
                anioSalida: input.anioSalida, edicion: input.edicion, codigo: input.codigo,
                tipoDocumento: tipoDocumentoBus._id, categoriaDocumento: categoriaDocumentoBus._id
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
            let categoriaDocumentoBus = await CategoriaDocumento.findById(input.categoriaDocumento);
            if (categoriaDocumentoBus == null){
                return {
                    statusCode: "400",
                    body: null,
                    errorCode: "0",
                    descriptionError: "Categoreia no encontrada"
                }
            }
            let documento = await Documento.findByIdAndUpdate(id, {
                titulo: input.titulo, autor: input.autor, editorial: input.editorial,
                anioSalida: input.anioSalida, edicion: input.edicion, codigo: input.codigo,
                tipoDocumento: tipoDocumentoBus._id, categoriaDocumento: categoriaDocumentoBus._id
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

    }
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