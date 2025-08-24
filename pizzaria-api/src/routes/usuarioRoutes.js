import express from 'express';
import { reistrarUsuario } from '../controllers/authController.js';

const router = express.Router();

// @desc Registrar um novo usuário
// @route POST /api/usuarios/registrar
// @access Público
router.post('/', reistrarUsuario);

export default router;