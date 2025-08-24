import express from 'express';
import { criarPizza, listarPizzas, obterPizzaPorId, atualizarPizza, deletarPizza } from '../controllers/pizzaController.js';
import { proteger, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc Criar uma nova pizza
// @route POST /api/pizzas
// @access Privado
router.post('/', proteger, admin, criarPizza);

// @desc Listar todas as pizzas
// @route GET /api/pizzas
// @access Público
router.get('/', listarPizzas);

// @desc Obter uma pizza por ID
// @route GET /api/pizzas/:id
// @access Público
router.get('/:id', obterPizzaPorId);

// @desc Atualizar uma pizza por ID
// @route PUT /api/pizzas/:id
// @access Privado
router.put('/:id', proteger, admin, atualizarPizza);

// @desc Deletar uma pizza por ID
// @route DELETE /api/pizzas/:id
// @access Privado
router.delete('/:id', proteger, admin, deletarPizza);

export default router;