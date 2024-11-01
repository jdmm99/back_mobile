import cors from 'cors';
import { Router } from "express";
import { metodosPrestamos } from '../controllers/prestamo.controllers.js';

const router = Router();

router.get('/prestamos/:usuario_id', cors({
    origin: 'http://localhost:8081'
}), metodosPrestamos.obtenerPrestamos);

export default router;