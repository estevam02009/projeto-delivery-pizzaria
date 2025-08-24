import express from 'express';
import { reistrarUsuario, loginUsuario, listarUsuarios } from '../controllers/authController.js';
import { proteger } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc Registrar um novo usuário
// @route POST /api/usuarios/registrar
// @access Público
router.post('/', reistrarUsuario);

// @desc Login de usuário
// @route POST /api/usuarios/login
// @access Público
router.post('/login', loginUsuario);

// @desc Listar todos os usuários
// @route GET /api/usuarios
// @access Privado
router.get('/', proteger, listarUsuarios);



export default router;