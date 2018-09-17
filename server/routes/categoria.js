const express = require('express');
let { VerificaToken, Verifica_Role } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');
const _ = require('underscore');



// =============================
// Mostrar todas las categorias
// =============================

app.get('/categoria', (req, res) => {
    Categoria.find({ estado: true })
        .populate("usuario")
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                categoria: categorias
            });

        })
})

// =============================
// Mostrar una categoria por ID
// =============================

app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            categoria
        });

    })

})

// =============================
// Crear nueva categorias
// =============================

app.post('/categoria', [VerificaToken], (req, res) => {
    let usuario_id = req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario_id
    })

    categoria.save((err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            usuario: categoria
        });
    })
})


// =============================
// Actualizar una categoria
// =============================

app.put('/categoria/:id', [VerificaToken, Verifica_Role], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let desCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            categoria
        });
    })
})

// =============================
// Eliminar una categoria
// =============================

app.delete('/categoria/:id', [VerificaToken, Verifica_Role], (req, res) => {
    // Solo un administrador puede borrar categorias
    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        categoria.estado = false;

        categoria.save((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                categoria
            });


        })

    })
})




module.exports = app;