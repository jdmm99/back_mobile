import cors from 'cors';
import { Router } from "express";
import { metodosUsuario } from '../controllers/usuario.controller.js';

const router = Router();

// Obtener perfil
router.get('/perfil/:usuario_id', cors({
    origin: 'http://localhost:8081' 
}), metodosUsuario.obtenerPerfil);

export default  router;



