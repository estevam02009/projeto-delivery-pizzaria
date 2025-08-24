import Usuario from '../models/Usuario.js'; // Importar o modelo de usuário
import bcrypt from 'bcryptjs'; // Importar o bcryptjs

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

export { reistrarUsuario };