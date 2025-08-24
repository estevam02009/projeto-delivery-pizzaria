import mongoose from 'mongoose';

// Definir o schema do usuário
const usuarioSchema = new mongoose.Schema({
    nomeCompleto: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    endereco: {
        rua: {
            type: String,
            required: true
        },
        numero: {
            type: String,
            required: true
        },
        bairro: {
            type: String,
            required: true
        },
    },
    telefone: {
        type: String,
        required: true
    },
    nivelAcesso: {
        type: String,
        required: true,
        default: 'cliente', // Valor padrão
        enum: ['cliente', 'admin'] // Limita os valores possiveis
    }
}, {
    timestamps: true
});

// Criar e exportar o modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
