const express = require('express');
const { VerificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

const _ = require('underscore');


// ============================
// Obtener todos los productos
// ============================

app.get('/productos', (req, res) => {
    // trae todos los productos
    // populeta: usuario categoria
    // paginado
    let limite = req.query.limite || 0
    limite = Number(limite)
    Producto.find({ disponible: true })
        .populate('usuario')
        .populate('categoria')
        .skip(limite)
        .limit(0)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: false,
                productos
            })
        })


})

// ============================
// Obtener producto por ID
// ============================

app.get('/productos/:id', (req, res) => {
    // populeta: usuario categoria
    let id = req.params.id;

    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            producto
        })
    })

})

// ============================
// Busqueda de productos
// ============================

app.get('/productos/busqueda/:termino', (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria')
        .populate('usuario')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!productos) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'No hay ningun resultado'
                    }
                })
            }

            return res.json({
                ok: true,
                productos
            })
        })
})

// ============================
// Crear un nuevo producto
// ============================

app.post('/productos', VerificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body;
    let usuario_id = req.usuario._id

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: usuario_id
    })

    producto.save((err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        return res.status(201).json({
            ok: true,
            producto
        });
    })


})

// ============================
// Actualizar un producto
// ============================

app.put('/productos/:id', VerificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let usuario_id = req.usuario._id;
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);


    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo actualizar el producto',

                }
            })
        }

        return res.json({
            ok: true,
            producto
        })
    })

})

// ============================
// Borrar un producto
// ============================

app.delete('/productos/:id', VerificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        producto.disponible = false;

        producto.save((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                producto
            })
        })


    })

})


module.exports = app;