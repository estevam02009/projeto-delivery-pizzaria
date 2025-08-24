import Usuario from '../models/Usuario.js'; // Importar o modelo de usuário
import bcrypt from 'bcryptjs'; // Importar o bcryptjs
import jwt from 'jsonwebtoken';

// @desc Registrar um novo usuário
// @route POST /api/usuarios/registrar
// @access Público
const registrarUsuario = async (req, res) => {
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

// @desc    Atualizar usuario
// @route   PUT /api/usuarios/:id
// @acesso  Privado (Apenas para o próprio usuário ou o admin do sistema)
const updateUsuario = async (req, res) => {
    const { id } = req.params; // ID do usuário
    const { senha } = req.body; // Puxamos a senha para trata-la separadamente

    try {
        // Verificar se o usuário existe
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        // Verificação de segurança: Apenas o proprio usuario ou um admin pode atualizar
        if (req.usuario._id.toString() !== usuario._id.toString() && req.usuario.nivelAcesso !== 'admin') {
            return res.status(403).json({ msg: 'Acesso negado. Usuário não é o próprio ou administrador.' });
        }

        // Se a senha for enviada
        if (senha) {
            const salt = await bcrypt.genSalt(10);
            req.body.senha = await bcrypt.hash(senha, salt);
        }

        // Encontrar e atualizar o usuário
        const usuarioAtualizado = await Usuario.findByIdAndUpdate(id, req.body, { 
            new: true,
            runValidators: true
        });
        res.status(200).json({ msg: 'Usuário atualizado com sucesso', usuario: usuarioAtualizado });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro no servidor', error: err.message });
    }
}

// @desc Obter um usuário por ID
// @route GET /api/usuarios/:id
// @access Privado
const obterPerfil = async (req, res) => {
    try {
       // acessar os dados do usuário que foram anexados à requisição pelo middleware "porteger"
       const usuario = {
        _id: req.usuario._id,
        nomeCompleto: req.usuario.nomeCompleto,
        email: req.usuario.email,
        nivelAcesso: req.usuario.nivelAcesso,
       }
       res.status(200).json(usuario);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro no servidor', error: err.message });
    }
}

// @desc    Excluir um usuário
// @route   DELETE /api/usuarios/:id
// @acesso  Privado (apenas para o próprio usuário ou admin)
const deleteUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    // Verificação de segurança: Apenas o próprio usuário ou um admin pode excluir
    if (req.usuario._id.toString() !== usuario._id.toString() && req.usuario.nivelAcesso !== 'admin') {
      return res.status(401).json({ mensagem: 'Não autorizado a excluir este usuário' });
    }

    await Usuario.findByIdAndDelete(id);

    res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
};

// Exportar a nova função
export { registrarUsuario, loginUsuario, listarUsuarios, obterPerfil, updateUsuario, deleteUsuario };
