import mongoose from 'mongoose';

// Função para conectar ao banco de dados
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Erro ao conectar ao MongoDB: ${err.message}`);
        process.exit(1);
    }
}

export default connectDB;
