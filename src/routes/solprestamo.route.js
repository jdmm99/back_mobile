import cors from 'cors';
import { Router } from "express";
import { metodosPrestamos } from '../controllers/prestamo.controllers.js';

const router = Router();

router.post('/prestamo', cors({
    origin: 'http://localhost:8081'
}), metodosPrestamos.solicitarPrestamo);

export default router;
