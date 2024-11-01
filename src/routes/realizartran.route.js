import cors from 'cors';
import { Router } from "express";
import { metodosTransacciones } from '../controllers/transaccion.controllers.js';

const router  = Router();

router.post('/transferencia', cors({
    origin: 'http://localhost:8081'
}), metodosTransacciones.realizarTransferencia);

export default router;
