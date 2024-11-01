import cors from 'cors';
import { Router } from "express";
import { metodosTransacciones } from '../controllers/transaccion.controllers.js';


const router = Router();

// Obtener todas las transacciones de un usuario
router.get('/usuario/:usuario_id', cors({
    origin: 'http://localhost:8081'
}), metodosTransacciones.obtenerTransacciones);

export default router;