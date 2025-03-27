const mysql = require('mysql2');
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
router.use(express.json());

router.get('/imagenes', (req, res) => {
    const sql = 'select * from imagenes_vehiculos';
    pool.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ status: 500, message: 'Error en la consulta...' })
        }
        res.status(200).json({ status: 200, message: 'Success', results });

    })
})

router.post('/imagenes', (req, res) => {
    let { idVehiculo,urlImagen} = req.body;

    if (!idVehiculo || !urlImagen) {
        return res.status(403).json({ status: 403, message: 'Todos los campos son obligatorios' });
    }

    const sql = "INSERT INTO imagenes_vehiculos (id_vehiculo,url_imagen) VALUES (?, ?)";
    pool.query(sql, [idVehiculo,urlImagen], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Error en la inserción de datos...', error: err });
        }
        res.status(201).json({ status: 201, message: 'venta agregada correctamente', imagenesVehiculos: req.body });
    });
});

router.put('/imagenes/:codigo', (req, res) => {
    let { idVehiculo,urlImagen} = req.body;

    if (!idVehiculo || !urlImagen) {
        return res.status(403).json({ status: 403, message: 'Todos los campos son obligatorios' });
    }

    const sql = 'UPDATE imagenes_vehiculos SET id_vehiculo = ?, url_image = ? WHERE id_imagen = ?';
    pool.query(sql,[idVehiculo,urlImagen], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ status: 500, message: 'Error al actualizar la imagen...', error: err });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ status: 404, message: 'Imagen no encontrada...' });
            }

            res.status(200).json({
                status: 200,
                message: 'Imagen actualizada con éxito',
                Imagen: { idVehiculo, urlImagen}
            });
        }
    );
});
router.delete('/ventas/:codigo',(req,res)=>{
    let codigo = req.params.codigo;
    if(!codigo){
        return res.status(403).json({status:403,message:'El codigo de la venta es un parametro requerido...'});
    }

    const sql ="DELETE FROM ventas WHERE id_venta = ?";
    pool.query(sql,[codigo],(err, results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({status:500,message:'Error al eliminar la venta...'});
        }

        if(results.affectedRows === 0){
            return res.status(404).json({status:404,message:'Venta no encontrada...'});
        }
        
        res.status(201).json({status:201,message:'Venta eliminada con exito'});        
    });
});

router.get('/ventas/:codigo',(req,res)=>{
    let codigo = req.params.codigo;
    if(!codigo){
        return res.status(403).json({status:403,message:'El codigo del cliente es un parametro requerido...'});
    }

    const sql ="SELECT * FROM ventas WHERE id_venta = ?";
    pool.query(sql,[codigo],(err, results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({status:500,message:'Error al intentar leer el registro...'});
        }
        
        res.status(200).json({status:200,message:'Success',results});        
    });
});


module.exports = router;