
const mysql = require('mysql2');
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
router.use(express.json());

router.get('/ventas', (req, res) => {
    const sql = 'select * from ventas';
    pool.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ status: 500, message: 'Error en la consulta...' })
        }
        res.status(200).json({ status: 200, message: 'Success', results });

    })
})

router.post('/ventas', (req, res) => {
    let { idVehiculo,idCliente,idVendedor,precio,impuestos,total,fecha_venta} = req.body;

    if (!idVehiculo || !idCliente || !idVendedor || !precio || !impuestos || !total || !fecha_venta) {
        return res.status(403).json({ status: 403, message: 'Todos los campos son obligatorios' });
    }

    const sql = "INSERT INTO ventas (id_vehiculo,id_cliente,id_vendedor,precio_final,impuestos,total,fecha_venta) VALUES (?, ?, ?, ?,?,?,?)";
    pool.query(sql, [idVehiculo,idCliente,idVendedor,precio,impuestos,total,fecha_venta], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Error en la inserción de datos...', error: err });
        }
        res.status(201).json({ status: 201, message: 'venta agregada correctamente', vehiculo: req.body });
    });
});

router.put('/ventas/:codigo', (req, res) => {
    let { idVehiculo, idCliente, idVendedor, precio_final, impuestos, total, fecha_venta } = req.body;

    if (
        idVehiculo == null || idCliente == null || idVendedor == null ||
        precio_final == null || impuestos == null || total == null || !fecha_venta
    ) {
        return res.status(403).json({ status: 403, message: 'Todos los campos son obligatorios' });
    }

    const sql = 'UPDATE ventas SET id_vehiculo = ?, id_cliente = ?, id_vendedor = ?, precio_final = ?, impuestos = ?, total = ?, fecha_venta = ? WHERE id_venta = ?';
    pool.query(sql,[idVehiculo, idCliente, idVendedor, precio_final, impuestos, total, fecha_venta, req.params.codigo], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ status: 500, message: 'Error al actualizar la venta...', error: err });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ status: 404, message: 'Venta no encontrada...' });
            }

            res.status(200).json({
                status: 200,
                message: 'Venta actualizada con éxito',
                venta: { idVehiculo, idCliente, idVendedor, precio_final, impuestos, total, fecha_venta }
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