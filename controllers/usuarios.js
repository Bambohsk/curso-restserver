const { response, request } = require('express');
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {
    // const { q, nombre = "no name", apikey } = req.query;
    const { limite = 5, desde = 0} = req.query;
    const query = { estado: true }

    /*
    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));
    // const total = await Usuario.countDocuments(query);
    */

    const [total, usuarios]= await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo , password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    

    // Encriptar la password, hacieendo el hash
    const salt = bcryptjs.genSaltSync(); //las vueltas por defecto son de 10
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en base de datos 
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async (req, res = response) => {
    const id  = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar contra base de datos
    if ( password ) {
        // Encriptar la password, hacieendo el hash
        const salt = bcryptjs.genSaltSync(); //las vueltas por defecto son de 10
        resto.password = bcryptjs.hashSync( password, salt );
    }
    const usuario = await Usuario.findByIdAndUpdate( id , resto );
    res.json( usuario );
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - Controlador'
    });
}

const usuariosDelete = async(req, res = response) => {

    const {id} = req.params;

    // Borrar fisicamente el usuario
    // const usuario = await Usuario.findByIdAndDelete( id ); 

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json(usuario);
}



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}