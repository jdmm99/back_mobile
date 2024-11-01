import cors from 'cors';
import { Router } from "express";
import { metodosUsuario} from '../controllers/usuario.controller.js';

const router = Router();

router.post('/registro', cors({
    origin: 'http://localhost:8081'
}), metodosUsuario.registrarUsuario);

export default router;