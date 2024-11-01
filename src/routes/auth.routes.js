import cors from 'cors';
import { Router } from "express";
import { metodosUsuario} from '../controllers/usuario.controller.js';

const router = Router();

// Inicio de sesión
router.get('/login', cors({
    origin: 'http://localhost:8081' 
}), metodosUsuario.iniciarSesion);

export default router;