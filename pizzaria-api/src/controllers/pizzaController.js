// src/controllers/pizzaController.js

import Pizza from '../models/Pizza.js';

// @desc    Criar uma nova pizza
// @route   POST /api/pizzas
// @acesso  Privado (apenas administradores)
const criarPizza = async (req, res) => {
  try {
    const { nome } = req.body;

    // Verificar se já existe uma pizza com o mesmo nome
    const pizzaExistente = await Pizza.findOne({ nome });

    if (pizzaExistente) {
      return res.status(400).json({ mensagem: 'Já existe uma pizza com este nome' });
    }

    // Criar uma nova pizza usando os dados do corpo da requisição
    const novaPizza = await Pizza.create(req.body);

    res.status(201).json({ mensagem: 'Pizza criada com sucesso!', pizza: novaPizza });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
};

// @desc    Listar todas as pizzas
// @route   GET /api/pizzas
// @acesso  Público
const listarPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.status(200).json({pizzas});
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
};

// @desc    Obter uma única pizza por ID
// @route   GET /api/pizzas/:id
// @acesso  Público
const obterPizzaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const pizza = await Pizza.findById(id);

    if (!pizza) {
      return res.status(404).json({ mensagem: 'Pizza não encontrada' });
    }

    res.status(200).json(pizza);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
};

// @desc    Atualizar uma pizza por ID
// @route   PUT /api/pizzas/:id
// @acesso  Privado (apenas administradores)
const atualizarPizza = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, ingredientes } = req.body;

    const pizza = await Pizza.findById(id);

    if (!pizza) {
      return res.status(404).json({ mensagem: 'Pizza não encontrada' });
    }
    
    // Atualizar os campos da pizza com os dados do corpo da requisição
    pizza.nome = nome;
    pizza.preco = preco;
    pizza.ingredientes = ingredientes;

    // Salvar as alterações no banco de dados
    await pizza.save();

    res.status(200).json({ mensagem: 'Pizza atualizada com sucesso!', pizza });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
};

// @desc    Deletar uma pizza por ID
// @route   DELETE /api/pizzas/:id
// @acesso  Privado (apenas administradores)
const deletarPizza = async (req, res) => {
  try {
    const { id } = req.params;

    const pizza = await Pizza.findById(id);

    if (!pizza) {
      return res.status(404).json({ mensagem: 'Pizza não encontrada' });
    }
    
    // Deletar a pizza do banco de dados
    await pizza.remove();

    res.status(200).json({ mensagem: 'Pizza deletada com sucesso!', pizza });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
};

export { criarPizza, listarPizzas, obterPizzaPorId, atualizarPizza, deletarPizza };
