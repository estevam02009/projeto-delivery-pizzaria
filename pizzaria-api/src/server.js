import express from 'express' // Importar o modulo express
import connectDB from '../config/database.js'; // Importar a função de conexão com o banco de dados
import dotenv from 'dotenv'; // Importar o dotenv
import usuarioRoutes from './routes/usuarioRoutes.js';
import pizzaRoutes from './routes/pizzaRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';

dotenv.config();

const app = express(); // Criar uma instancia do express
const port = process.env.PORT || 5000; // Definir a porta do servidor

// Middleware para analisar o corpo da requisição com formato JSON
app.use(express.json());

// Conectar ao banco de dados
connectDB();

// Rotas de autenticação
app.use('/api/usuarios', usuarioRoutes);
// Rotas de pizzas
app.use('/api/pizzas', pizzaRoutes);
// Rotas de pedidos
app.use('/api/pedidos', pedidoRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
