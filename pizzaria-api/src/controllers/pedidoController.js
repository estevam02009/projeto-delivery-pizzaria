import Pedido from '../models/Pedidos.js';
import Pizza from '../models/Pizza.js';

// @desc Criar um novo pedido
// @route POST /api/pedidos
// @access Private
const criarPedido = async (req, res) => {
    const { items, deliveryAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Adicione pelo menos uma pizza ao pedido' });
    }

    try {
        let totalAmount = 0;
        const pedidoItems = [];

        // Validar e calcular o preço total no servidor
        for (const item of items) {
            const pizza = await Pizza.findById(item.pizza);

            // console.log('Documento da pizza recuperado:', pizza); // Linha para depuração

            if (!pizza) {
                return res.status(400).json({ message: `Pizza com ID ${item.pizza} não encontrada` });
            }

            // Encotrar o preço do tamanhp correto
            const precoItem = pizza.precos.find(p => p.tamanho === item.tamanho);
            if (!precoItem) {
                return res.status(400).json({ mensagem: `O tamanho ${item.tamanho} não está disponível para a pizza ${pizza.nome}` });
            }

            // Adicionar o preço correto do servidor ao item e calcular o valor total
            const itemPrecoTotal = precoItem.preco * item.quantity;
            totalAmount += itemPrecoTotal;

            // Adicionar o item ao array de itens do pedido
            pedidoItems.push({
                pizza: item.pizza,
                quantity: item.quantity,
                price: itemPrecoTotal,
                tamanho: item.tamanho,
                specialInstructions: item.specialInstructions
            });
        }

        // Crioar o pedido no banco de dados
        const novoPedido = await Pedido.create({
            user: req.usuario.id,
            items: pedidoItems,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            notes,
            paymentStatus: 'pendente'
        });

        res.status(201).json({ mensagem: 'Pedido criado com sucesso!', pedido: novoPedido });
    } catch (err) {
        console.error('Erro ao criar o pedido:', err);
        res.status(500).json({ mensagem: 'Erro ao criar o pedido', erro: err.message });
    }
}

export { criarPedido };