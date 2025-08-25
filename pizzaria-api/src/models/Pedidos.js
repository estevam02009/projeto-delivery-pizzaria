// src/models/Pedido.js

import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Mudando para 'Usuario' para ser consistente com o nosso modelo
    required: true
  },
  items: [{
    pizza: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pizza',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    tamanho: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    specialInstructions: String
  }],
  status: {
    type: String,
    enum: ['pendente', 'confirmado', 'preparando', 'fazendo', 'pronta', 'saída para entrega', 'entregue', 'cancelado'],
    default: 'pendente'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'dinheiro', 'pix'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pendente', 'pago', 'falhou', 'estornado'],
    default: 'pendente'
  },
  notes: String,
}, {
  timestamps: true // Adicionando timestamps aqui para `createdAt` e `updatedAt`
});

export default mongoose.model('Pedido', pedidoSchema);