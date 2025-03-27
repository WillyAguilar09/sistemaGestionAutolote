const express = require('express');
const app = express();
const port = 3000;
const usuarioRoutes=require('./routes/usuarios')
const vehiculosRoutes = require('./routes/vehiculos');
const authRoutes =require('./routes/authUser')
const clientesRoutes=require('./routes/clientes')
app.use(express.json());
app.use('/api',usuarioRoutes)
app.use('/api',vehiculosRoutes)
app.use('/api',authRoutes)
app.use('/api',clientesRoutes)




app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});