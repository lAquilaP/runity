const userService = require("../services/user.service");

async function me(req, res) {
    try {
        const user = await userService.getProfile(req.userId);

        return res.status(200).json(user);

    } catch (error) {
        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                error: "Usuário não encontrado."
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
}
async function updateMe(req, res) {
    try {
        const { name, username, bio } = req.body;

        const user = await userService.updateProfile(
            req.userId,
            {
                name,
                username,
                bio
            }
        );

        return res.status(200).json({
            message: "Perfil atualizado com sucesso.",
            user
        });

    } catch (error) {
        if (error.message === "USERNAME_ALREADY_EXISTS") {
            return res.status(409).json({
                error: "Este username já está em uso."
            });
        }

        if (error.message === "INVALID_NAME") {
            return res.status(400).json({
                error: "Nome inválido."
            });
        }

        if (error.message === "INVALID_USERNAME") {
            return res.status(400).json({
                error: "Username inválido."
            });
        }

        if (error.message === "NO_FIELDS_TO_UPDATE") {
            return res.status(400).json({
                error: "Nenhum campo foi informado para atualização."
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
}

async function getById(req, res) {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                error: "ID de usuário inválido."
            });
        }

        const user = await userService.getPublicProfile(userId);

        return res.status(200).json(user);

    } catch (error) {
        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                error: "Usuário não encontrado."
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
}

module.exports = {
    me,
    updateMe,
    getById
};