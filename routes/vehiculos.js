const mysql = require('mysql2');
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
router.use(express.json());

router.get('/vehiculos', (req, res) => {
    const sql = 'select * from vehiculos';
    pool.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ status: 500, message: 'Error en la consulta...' })
        }
        res.status(200).json({ status: 200, message: 'Success', results });

    })
})

router.post('/vehiculos', (req, res) => {
    let { marca, modelo, año, precio, disponibilidad, descripcion, fecha_publicacion } = req.body;

    if (!marca || !modelo || !año || !precio || disponibilidad == null || !descripcion || !fecha_publicacion) {
        return res.status(403).json({ status: 403, message: 'Todos los campos son obligatorios' });
    }

    const sql = "INSERT INTO vehiculos (marca, modelo, año, precio, disponibilidad, descripcion, fecha_publicacion) VALUES (?, ?, ?, ?, ?, ?, ?)";
    pool.query(sql, [marca, modelo, año, precio, disponibilidad, descripcion, fecha_publicacion], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Error en la inserción de datos...', error: err });
        }
        res.status(201).json({ status: 201, message: 'Vehículo agregado correctamente', vehiculo: req.body });
    });
});

router.put('/vehiculos/:codigo', (req, res) => {
    let { marca, modelo, año, precio, disponibilidad, descripcion, fecha_publicacion } = req.body;

    if (!marca || !modelo || !año || !precio || disponibilidad == null || !descripcion || !fecha_publicacion) {
        return res.status(403).json({ status: 403, message: 'Todos los campos son obligatorios' });
    }

    const sql = "UPDATE vehiculos SET marca = ?, modelo = ?, año = ?, precio = ?, disponibilidad = ?, descripcion=?, fecha_publicacion=? WHERE id_vehiculo = ?";
    pool.query(sql, [marca, modelo, año, precio, disponibilidad, descripcion, fecha_publicacion, req.params.codigo], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Error al actualizar el vehiculo...' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ status: 404, message: 'Vehiculo no encontrado...' });
        }
        res.status(200).json({ status: 200, message: 'Vehiculo actualizado con éxito', vehiculo: { marca, modelo, año, precio, disponibilidad, descripcion, fecha_publicacion } });
    });
});
router.delete('/vehiculos/:codigo',(req,res)=>{
    let codigo = req.params.codigo;
    if(!codigo){
        return res.status(403).json({status:403,message:'El codigo del vehiculo es un parametro requerido...'});
    }

    const sql ="DELETE FROM vehiculos WHERE id_vehiculo = ?";
    pool.query(sql,[codigo],(err, results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({status:500,message:'Error al eliminar el vehiculo...'});
        }

        if(results.affectedRows === 0){
            return res.status(404).json({status:404,message:'Vehiculo no encontrado...'});
        }
        
        res.status(201).json({status:201,message:'Vehiculo eliminado con exito'});        
    });
});
router.get('/vehiculos/:codigo',(req,res)=>{
    let codigo = req.params.codigo;
    if(!codigo){
        return res.status(403).json({status:403,message:'El codigo del vehiculo es un parametro requerido...'});
    }

    const sql ="SELECT * FROM vehiculos WHERE id_vehiculo = ?";
    pool.query(sql,[codigo],(err, results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({status:500,message:'Error al intentar leer el registro...'});
        }
        
        res.status(200).json({status:200,message:'Success',results});        
    });
});


module.exports = router;

