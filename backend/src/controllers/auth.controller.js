const authService = require("../services/auth.service");

async function register(req, res) {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({
                error: "Nome, username, email e senha são obrigatórios."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: "A senha deve possuir pelo menos 8 caracteres."
            });
        }

        const user = await authService.register({
            name,
            username,
            email,
            password
        });

        return res.status(201).json({
            message: "Usuário cadastrado com sucesso.",
            user
        });

    } catch (error) {
        if (error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({
                error: "Este email já está cadastrado."
            });
        }

        if (error.message === "USERNAME_ALREADY_EXISTS") {
            return res.status(409).json({
                error: "Este username já está em uso."
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email e senha são obrigatórios."
            });
        }

        const result = await authService.login({
            email,
            password
        });

        return res.status(200).json(result);

    } catch (error) {
        if (error.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                error: "Email ou senha inválidos."
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
}

module.exports = {
    register,
    login
};