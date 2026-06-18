//Importamos express y las funciones que vamos a usar en las rutas.
import express from 'express';
import cookieParser from 'cookie-parser';
import pool from './backend/src/datos/conexion-bd.mjs'
import bcrypt from 'bcryptjs';
import {nanoid} from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import {obtenerLibros, obtenerLibroPorId} from "./backend/src/funciones/funcionesApi.mjs"
import {verificarEstadoInventario, verificarDisponibilidadLibro, avisoLibrosSinStock} from "./backend/src/funciones/middlewares.mjs"

const puerto = 3000 //=> puerto en el que se va a ejecutar el servidor.

const app = express() //=> para crear una instancia de express, que es el servidor que vamos a usar para manejar las peticiones y respuestas (req, y res).

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); //=> Para usar path es necesario volverlos a recrear...

app.use(express.json()) //=> Hacemos que express pueda recibir en .json
app.use(express.urlencoded({extender:true})) //=> Hace que todas las peticiones http (req) puedan ser manejadas como un objeto JS
app.use(cookieParser()); //=> nos permite usar cookieParser, para manejar las cookies
app.use(express.static(path.join(__dirname, 'frontend')))

app.use('/login', express.static('./frontend/front-general'))


const verificarSesion = (req, res, next) => {
    if (req.cookies && req.cookies.sesion_id) {
        next(); 
    } else {
        return res.status(401).redirect('/login'); 
    }
};

app.get('/logout', (req, res) =>{ //=> Para cerrar la sesión, borrar las cookies, y que cuando se cierre la sesión no se pueda ir a ningúna otra ventana que no sea login. 
    res.clearCookie('sesion_id').redirect('/login');
})

app.get('/catalogo', verificarSesion, (req, res)=>{
    res.sendFile(path.join(__dirname, 'frontend/front-general', 'catalogo.html'))
})

app.get('/api/v1/libros', verificarSesion, verificarEstadoInventario, obtenerLibros)

app.get('/api/v1/libros/:id', verificarSesion, verificarDisponibilidadLibro, obtenerLibroPorId)

app.post('/api/v1/libros/valor-total-inventario', verificarSesion, avisoLibrosSinStock)

app.post('/ingresar', async (req, res)=>{
    const {usuario, pass} = req.body;

    if (!usuario || !pass){
        return res.status(400).json({
            mensaje:'Datos incompletos'
        });
    }
    try{
        const resultado = await pool.query(
            'SELECT * FROM usuarios where username = $1', [usuario]
        );

        if (resultado.rowCount === 0){
            return res.status(401).json({mensaje: 'Usuario o contraseña incorrectos'});
        }

        const usuarioDb = resultado.rows[0];

        const loginCorrecto = await bcrypt.compare(pass, usuarioDb.password_hash);

        if (loginCorrecto){
            const idSesion = nanoid();

            res.cookie('sesion_id', idSesion,{httpOnly: true});

            return res.redirect('/catalogo')
        } else{
            return res.status(401).json({
                mensaje: `Usuario o contraseña incorrectos`
            });
        }
    }
    catch(error){
        console.error(error);
        console.log(error);
        return res.status(500).json({mensaje: `Error en el servidor`});
    }
})

app.post('/registrar', async (req, res)=>{
    const {usuario, pass} = req.body
    
    if(!usuario || !pass){
        return res.status(400).json({
            mensaje:'Datos incompletos'
        })
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);
    
    const resultado = await pool.query(`
        INSERT INTO usuarios
            (username, password_hash)
        VALUES
            ($1, $2)
        RETURNING
            id, username
        `,
    [
        usuario,
        hash
    ])

    if (resultado.rowCount > 0){
        return res.json({
            mensaje:`El usuario ${usuario} ha sido registrado`
        })
    }
    else{
        return res.json({
            mensaje: 'Error en el registro. Vuelva a intentarlo.'
        })
    }
})

app.listen(puerto, ()=>{
    console.log(`Servidor corriendo en: http://localhost:${puerto}`)
})

//Me abrumaron los comentarios y los borré a todos.