const mysql =require('mysql2');
const express=require('express');
const router=express.Router();
const pool =require('../config/db');
router.use(express.json());
router.get('/usuarios',(req,res)=>{
    const sql='select * from usuarios';
    pool.query(sql,(err,results)=>{
        if (err){
            return res.status(500).json({status:500,message:'Error en la consulta...'})
        }
        res.status(200).json({status:200,message:'Success',results});

    })
})
router.post('/usuarios', (req, res) => {
    let { nombre, correo, contraseña, rol, fecha_creacion } = req.body;
    if (!nombre || !correo || !contraseña || !rol || !fecha_creacion) {
        return res.status(403).json({ status: 403, message: 'Todos los campos son obligatorios' });
    }
    const sql = "INSERT INTO usuarios (nombre, correo, contraseña, rol, fecha_creacion) VALUES (?, ?, ?, ?, ?)";
    pool.query(sql, [nombre, correo, contraseña, rol, fecha_creacion], (err, results) => {
        if (err) {
            return res.status(500).json({ status: 500, message: 'Error en la inserción de datos...', error: err });
        }
        res.status(201).json({ status: 201, message: 'Usuario creado con éxito', usuario: { nombre, correo, rol, fecha_creacion } });
    });
});
router.put('/usuarios/:codigo', (req, res) => {
    let { nombre, correo, contraseña, rol, fecha_creacion } = req.body;

    if (!nombre || !correo || !contraseña || !rol || !fecha_creacion) {
        return res.status(403).json({ status: 403, message: 'Todos los campos son obligatorios' });
    }

    const sql = "UPDATE usuarios SET nombre = ?, correo = ?, contraseña = ?, rol = ?, fecha_creacion = ? WHERE id_usuario = ?";
    pool.query(sql, [nombre, correo, contraseña, rol, fecha_creacion, req.params.codigo], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Error al actualizar el usuario...' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado...' });
        }
        res.status(200).json({ status: 200, message: 'Usuario actualizado con éxito', usuario: { nombre, correo, rol, fecha_creacion } });
    });
});
router.delete('/usuarios/:codigo',(req,res)=>{
    let codigo = req.params.codigo;
    if(!codigo){
        return res.status(403).json({status:403,message:'El identificador del usuario es un parametro requerido...'});
    }

    const sql ="DELETE FROM usuarios WHERE id_usuario = ?";
    pool.query(sql,[codigo],(err, results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({status:500,message:'Error al eliminar el registro...'});
        }

        if(results.affectedRows === 0){
            return res.status(404).json({status:404,message:'Usuario no encontrado...'});
        }
        
        res.status(201).json({status:201,message:'Usuario eliminado con exito'});        
    });
});
module.exports=router;