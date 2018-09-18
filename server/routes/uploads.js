const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Productos = require('../models/producto');

const fs = require('fs');
const path = require('path')

// default options
app.use(fileUpload());



app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    // tipos validos
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')

            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones validas
    let ExtensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (ExtensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Error extensiones permitidas son: ' + ExtensionesValidas.join(', '),
                ext: extension

            }
        })
    }

    // Cambiar nombre al archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Aqui la imagen se cargo
        if (tipo === 'usuarios') {
            imagenUsurio(id, res, nombreArchivo)
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo)
        }
    });
});

function imagenUsurio(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(usuarioDB.img, 'usuarios')

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borraArchivo(usuarioDB.img, 'usuarios')

            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                usuario: usuarioGuardado
            })
        })


    })
}

function imagenProducto(id, res, nombreArchivo) {
    Productos.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(productoDB.img, 'productos')

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borraArchivo(productoDB.img, 'productos')

            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borraArchivo(productoDB.img, 'productos')


        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                usuario: productoGuardado
            })
        })

    })
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;