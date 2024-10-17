const express = require('express'); //Imortar librerias internas
const mongoose = require('mongoose');
const cors = require('cors');

const {ApolloServer, gql} = require('apollo-server-express'); //Importar librerias externas

//const Reclamo = require('./models/reclamo');
//const Categoria = require('./models/categoria');

const typeDefs = gql`

    type Usuario{
        id: ID!
        rut: Number!
        nombres: String!
        apellidos: String!
        direccion: String!
        telefono: Number!
        activo: Number!
    }

    input UsuarioInput{
        rut: Number!
        nombre: String!
        nombres: String!
        apellidos: String!
        direccion: String!
        telefono: Number!
        activo: Number!
    }

    type Prestamo{
        id: ID!
        tipoPrestamo: String!
        ejemplares: [Ejemplar]!
        fechaPrestamo: String!
        fechaDevolucion: Date!
        fechaDevolucionReal: Date!
        solicitudPrestamo: SolicitudPrestamo
    }

    input PrestamoInput{
        tipoPrestamo: String!
        ejemplares: [Ejemplar]!
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

    type DetalleSolicitudPrestamo{
        id: ID!
        ejemplares: [Ejemplar]
        solicitud: Solicitud
    }

    input DetalleSolicitudPrestamoInput{
        ejemplares: [Ejemplar]
        solicitud: Solicitud
    }

    type SolicitudPrestamo{
        id: ID!
        usuario: [Usuario]
        fechaSolicitud: String!
    }

    input SolicitudPrestamoInput{
        usuario: [Usuario]
        fechaSolicitud: String!
    }

    type Alert{
        message: String
    }
    
    type Response{
        message: String
    }

    type Query{
        getReclamos: [Reclamo]
        getReclamosCategoria(id: ID!): Reclamo
        getReclamosById(id: ID!): Reclamo
        getCategorias: [Categoria]
        getCategoriasById(id: ID!): Categoria

    }

    type Mutation{
        addReclamo(input: ReclamoInput): Reclamo
        updReclamo(id: ID!, input: ReclamoInput): Reclamo
        delReclamo(id: ID!): Alert
        addCategoria(input: CategoriaInput): Categoria
        updCategoria(id: ID!, input: CategoriaInput): Categoria
        delCategoria(id: ID!): Alert
    }

`;

const resolvers = {

    Query: {
        async getReclamos(obj){
            const reclamos = await Reclamo.find();
            return reclamos
        },

        async getReclamosById(obj, {id}){
            const reclamo = await Reclamo.findById(id);
            return reclamo;
        },

        async getCategorias(obj){
            const categorias = await Categoria.find();
            return categorias
        },

        async getCategoriasById(obj, {id}){
            const categoria = await Categoria.findById(id);
            return categoria;
        },

        async getReclamosCategoria() {
            const reclamos = await Reclamo.find().populate("Categoria");
            return reclamos;
        }
          
    },
    
    Mutation: {

        async addReclamo(obj, {input}){
            const reclamo = new Reclamo(input);
            await reclamo.save();
            return reclamo;
        },

        async updReclamo(obj, {id, input}){
            const reclamo = await Reclamo.findByIdAndUpdate(id, input);
            return reclamo;
        },

        async delReclamo(obj, {id}){
            await Reclamo.deleteOne({_id: id});
            return {
                message: "Reclamo Eliminado"
            }
        },

        async addCategoria(obj, {input}){
            const categoria = new Categoria(input);
            await categoria.save();
            return categoria;
        },

        async updCategoria(obj, {id, input}){
            const categoria = await Categoria.findByIdAndUpdate(id, input);
            return categoria;
        },

        async delCategoria(obj, {id}){
            await Categoria.deleteOne({_id: id});
            return {
                message: "Categoria Eliminada"
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