import cors from 'cors';
import { Router } from "express";
import { metodosPrestamos } from '../controllers/prestamo.controllers.js';

const router = Router();

router.put('/prestamo/:prestamo_id', cors({
    origin: 'http://localhost:8081'
}), metodosPrestamos.actualizarEstadoPrestamo);

export default router;



