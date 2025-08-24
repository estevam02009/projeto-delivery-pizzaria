// Lógica do Middleware: O nosso middleware fará o seguinte:
// Verificar se um token foi enviado no cabeçalho da requisição.
// Decodificar o token usando a nossa chave secreta (JWT_SECRET).
// Se o token for válido, ele anexará os dados do usuário à requisição (req) e passará a requisição para a próxima função.
// Se o token for inválido ou não existir, ele enviará um erro 401 (Não Autorizado).
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const proteger = async (req, res, next) => {
    let token;

    // Verificar se o token existe no header da requisição
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extrair o token do header
            token = req.headers.authorization.split(' ')[1];
            // Verificar e decodificar o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Adicionar o usuário ao objeto de requisição
            req.usuario = await Usuario.findById(decoded.id).select('-senha');
            next();
        } catch (err) {
            console.error(err.message);
            res.status(401).json({ msg: 'Token inválido' });
        }
    }

    // Se o token não existir
    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado. Nenhum token fornecido.' });
    }
}

export { proteger };