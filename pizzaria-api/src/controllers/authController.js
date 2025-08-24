import Usuario from '../models/Usuario.js'; // Importar o modelo de usuário
import bcrypt from 'bcryptjs'; // Importar o bcryptjs
import jwt from 'jsonwebtoken';

// @desc Registrar um novo usuário
// @route POST /api/usuarios/registrar
// @access Público
const reistrarUsuario = async (req, res) => {
    // Desestruturar os dados no corpo da requisição
    const { nomeCompleto, email, senha, endereco, telefone, nivelAcesso } = req.body; 

    try {
        // Verifica se o usuário já existe no banco dedados
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ msg: 'Email já registrado' });
        }

        // Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        // crair um novo usuário
        const novoUsuario = new Usuario({
            nomeCompleto,
            email,
            senha: senhaCriptografada,
            endereco,
            telefone,
            nivelAcesso
        });

        // Salvar o novo usuário no banco de dados
        await novoUsuario.save();
        res.status(201).json({ msg: 'Usuário registrado com sucesso', novoUsuario });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro no servidor', error: err.message });
    }
}

// @desc Login de usuário
// @route POST /api/usuarios/login
// @access Público
const loginUsuario = async (req, res) => {
    // Desestruturar os dados no corpo da requisição
    const { email, senha } = req.body;

    try {
        // Verificar se o usuário existe
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'Email ou senha inválidos' });
        }

        // Verificar se a senha está correta
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(400).json({ msg: 'Email ou senha inválidos' });
        }

        // Criar um token JWT
        const token = jwt.sign({ id: usuario._id, nivelAcesso: usuario.nivelAcesso }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token expira em 1 hora
        });

        res.status(200).json({ 
            _id: usuario._id,
            nomeCompleto: usuario.nomeCompleto,
            email: usuario.email,
            nivelAcesso: usuario.nivelAcesso,
            token
         });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro no servidor', error: err.message });
    }
}

// @desc Obter todos os usuários
// @route GET /api/usuarios
// @access Privado
const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find({});
        res.status(200).json(usuarios);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro no servidor', error: err.message });
    }
}

export { reistrarUsuario, loginUsuario, listarUsuarios };
