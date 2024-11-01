import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import authRuta from './routes/auth.routes.js';
import registroRuta from  './routes/registro.route.js';
import transaccionRuta from  './routes/transaccion.route.js';
import realizarTransaccion from   './routes/realizartran.route.js';
import realizarDeposito from './routes/deposito.route.js';
import realizarRetiro from  './routes/retiro.route.js';
import solicitarPrestamo from './routes/solprestamo.route.js'
import obtenerPrestamo  from './routes/obtprestamo.route.js'
import actualizarPrestamo from './routes/updateprestamo.route.js'


const app = express()

//Configuración
app.set('port',process.env.PORT || 3000);

// Middleware
app.use(morgan('dev'));
app.use(express.json()); // 

// Configuración CORS
const corsOptions = {
    origin: 'http://localhost:8081'
};
app.use(cors(corsOptions));

// Rutas
app.use('/api/auth', authRuta);
app.use('/api/usuario', registroRuta);
app.use('/api/transacciones', transaccionRuta);
app.use('/api/transacciones', realizarTransaccion);
app.use('/api/transacciones', realizarDeposito);
app.use('/api/transacciones/',realizarRetiro);
app.use('/api/prestamos/', solicitarPrestamo);
app.use('/api/prestamos/', obtenerPrestamo);
app.use('/api/prestamos/',actualizarPrestamo)


// Ruta de prueba
// app.get('/', (req, res) => {
//     res.json({ 
//         mensaje: 'Bienvenido a Estebanquito Backend',
//         estado: 'Activo' 
//     });
// });

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({
        mensaje: 'Ruta no encontrada :C'
    });
});

app.use('/prueba',authRuta)

export default app;