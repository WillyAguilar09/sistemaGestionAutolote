const mysql = require('mysql2');
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
router.use(express.json());

router.get('/clientes', (req, res) => {
    const sql = 'select * from clientes';
    pool.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ status: 500, message: 'Error en la consulta...' })
        }
        res.status(200).json({ status: 200, message: 'Success', results });

    })
})

router.post('/clientes', (req, res) => {
    let { nombre,correo,telefono,fecha_registro} = req.body;

    if (!nombre || !correo || !telefono || !fecha_registro) {
        return res.status(403).json({ status: 403, message: 'Todos los campos son obligatorios' });
    }

    const sql = "INSERT INTO clientes (nombre,correo,telefono,fecha_registro) VALUES (?, ?, ?, ?)";
    pool.query(sql, [nombre,correo,telefono,fecha_registro], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Error en la inserción de datos...', error: err });
        }
        res.status(201).json({ status: 201, message: 'Cliente agregado correctamente', vehiculo: req.body });
    });
});

router.put('/clientes/:codigo', (req, res) => {
    let { nombre,correo,telefono,fecha_registro} = req.body;

    if (!nombre || !correo || !telefono || !fecha_registro) {
        return res.status(403).json({ status: 403, message: 'Todos los campos son obligatorios' });
    }

    const sql = "UPDATE clientes SET nombre=?,correo=?,telefono=?,fecha_registro=? WHERE id_cliente = ?";
    pool.query(sql, [nombre,correo,telefono,fecha_registro, req.params.codigo], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Error al actualizar el cliente...' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ status: 404, message: 'Cliente no encontrado...' });
        }
        res.status(200).json({ status: 200, message: 'Cliente actualizado con éxito', cliente: { nombre,correo,telefono,fecha_registro} });
    });
});
router.delete('/clientes/:codigo',(req,res)=>{
    let codigo = req.params.codigo;
    if(!codigo){
        return res.status(403).json({status:403,message:'El codigo del cliente es un parametro requerido...'});
    }

    const sql ="DELETE FROM clientes WHERE id_cliente = ?";
    pool.query(sql,[codigo],(err, results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({status:500,message:'Error al eliminar el cliente...'});
        }

        if(results.affectedRows === 0){
            return res.status(404).json({status:404,message:'Cliente no encontrado...'});
        }
        
        res.status(201).json({status:201,message:'Cliente eliminado con exito'});        
    });
});
router.get('/clientes/:codigo',(req,res)=>{
    let codigo = req.params.codigo;
    if(!codigo){
        return res.status(403).json({status:403,message:'El codigo del cliente es un parametro requerido...'});
    }

    const sql ="SELECT * FROM clientes WHERE id_cliente = ?";
    pool.query(sql,[codigo],(err, results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({status:500,message:'Error al intentar leer el registro...'});
        }
        
        res.status(200).json({status:200,message:'Success',results});        
    });
});


module.exports = router;