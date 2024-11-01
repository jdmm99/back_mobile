import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import authRuta from './routes/auth.routes.js';
import usuarioRuta from './routes/usuario.routes.js';
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
app.use('/api/usuarios', usuarioRuta);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        mensaje: 'Bienvenido a Estebanquito Backend',
        estado: 'Activo' 
    });
});

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({
        mensaje: 'Ruta no encontrada'
    });
});

export default app;