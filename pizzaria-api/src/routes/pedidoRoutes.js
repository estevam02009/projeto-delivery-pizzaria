import express from 'express';
import { criarPedido } from '../controllers/pedidoController.js';
import { proteger, admin } from '../middleware/authMiddleware.js';


const router = express.Router();

// @desc Criar um novo pedido
// @route POST /api/pedidos
// @access Privado
router.post('/', proteger, criarPedido);

export default router;