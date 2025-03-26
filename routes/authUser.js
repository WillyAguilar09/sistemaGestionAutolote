const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware')
const bcrypt = require('bcryptjs');

require('dotenv').config();

router.post('/login', async (req, res) => {
    const {correo, contraseña} = req.body;

    const sql = 'SELECT * FROM usuarios WHERE correo = ?';

    pool.query(sql, [correo], async (err, resultado) => {
        if (err) {
            return res.status(500).json({status: 500, message: 'Error del servidor'});
        }

        if (resultado.length === 0) {
            return res.status(401).json({status: 401, message: 'Credenciales inválidas...'});
        }

        let user = resultado[0];
        const isMatch = await bcrypt.compare(contraseña, user.contraseña);
        if (!isMatch) {
            return res.status(401).json({status: 401, message: 'Credenciales inválidas...'});
        }

        const token = jwt.sign(
            {id: user.id_usuario, username: user.nombre},
            process.env.SECRET_KEY,
            {expiresIn: '1h'}
        );
        res.json({status: 200, message: 'Success', token});
    });
});
router.post('/users', async (req, res) => {
    const {nombre, correo, contraseña, rol, fechaCreacion} = req.body;

    const sql = 'INSERT INTO usuarios (nombre, correo, contraseña, rol, fechaCreacion) VALUES (?, ?, ?, ?, ?)';

    const saltRound = 10;
    const passwordEncrypt = await bcrypt.hash(contraseña, saltRound);

    pool.query(sql, [nombre, correo, passwordEncrypt, rol, fechaCreacion], (err, resultado) => {
        if (err) {
            return res.status(500).json({status: 500, message: 'Error del servidor'});
        }

        res.json({status: 200, message: 'Success', codigo: resultado.insertId});
    });
});
router.get('/users',authMiddleware ,async (req,res)=>{
    
    const sql = 'select id_usuario, nombre, correo, contraseña, rol, fecha_creacion from usuarios ';

    pool.query(sql,  (err,resultado)=>{
        if(err){
            return res.status(500).json({status:500,message:'Error del servidor'});
        }

        res.json({status:200,message:'Success', data: resultado});
    });
});

module.exports = router;
