import express from 'express';
import { registrarUsuario, loginUsuario, listarUsuarios, updateUsuario, obterPerfil, deleteUsuario } from '../controllers/authController.js';
import { proteger, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc Registrar um novo usuário
// @route POST /api/usuarios/registrar
// @access Público
router.post('/', registrarUsuario);

// @desc Deletar um usuário
// @route DELETE /api/usuarios/:id
// @access Privado
router.delete('/:id', proteger, deleteUsuario);

// @desc Atualizar um usuário
// @route PUT /api/usuarios/:id
// @access Privado
router.put('/:id', proteger, updateUsuario);

// @desc Login de usuário
// @route POST /api/usuarios/login
// @access Público
router.post('/login', loginUsuario);

// @desc Listar todos os usuários
// @route GET /api/usuarios
// @access Privado
router.get('/', proteger, admin, listarUsuarios);

// @desc Obter o perfil do usuário
// @route GET /api/usuarios/me
// @access Privado
router.get('/me', proteger, obterPerfil);




export default router;