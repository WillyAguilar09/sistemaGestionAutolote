
const mysql = require('mysql2');
require('dotenv').config();
const pool =mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    
})

pool.getConnection((error,mysql)=>{
    if (error){
        console.log("Error de Conexion")
    }else 
    {
        console.log("Conexion Exitosa")
    }
})
module.exports=pool;