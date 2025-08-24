import mongoose from 'mongoose';

// Criar o Schema para os preços (tamanho e preço)
const PrecoSchema = new mongoose.Schema({
    tamanho: {
        type: String,
        required: true,
        enum: ['Pequena', 'Média', 'Grande', 'familia'] // Tamanho predefinido
    },
    preco: {
        type: Number,
        required: true,
    }
})

// Criar o Schema principal para a Pizza
const PizzaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
    },
    descricao: {
        type: String,
        required: true,
    },
    ingredientes: [{
        type: String,
        required: true,
    }],
    preco: [PrecoSchema], // Usamos o Schema do preço aqui
    imagem: {
        type: String,
        default: 'sem_imagem.jpg' // Url da imagem, com um valor padrão
    }
}, {
    timestamps: true,
})

// Criar o Model com o Schema
const Pizza = mongoose.model('Pizza', PizzaSchema);

export default Pizza;
