
const groupService = require("../services/group.service");

async function create(req, res) {
    try {
        const group = await groupService.createGroup(
            req.userId,
            req.body || {}
        );

        return res.status(201).json({
            message: "Grupo criado com sucesso.",
            group
        });

    } catch (error) {
        if (error.message === "INVALID_GROUP_NAME") {
            return res.status(400).json({
                error: "Informe um nome válido para o grupo."
            });
        }

        if (error.message === "INVALID_DESCRIPTION") {
            return res.status(400).json({
                error: "Descrição inválida."
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
}
async function list(req, res) {
    try {
        const groups = await groupService.listGroups();

        return res.status(200).json(groups);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
}

async function getById(req, res) {
    try {
        const groupId = Number(req.params.id);

        if (!Number.isSafeInteger(groupId) || groupId <= 0) {
            return res.status(400).json({
                error: "ID de grupo inválido."
            });
        }

        const group = await groupService.getGroupById(groupId);

        return res.status(200).json(group);
    } catch (error) {
        if (error.message === "GROUP_NOT_FOUND") {
            return res.status(404).json({
                error: "Grupo não encontrado."
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
}
async function join(req, res) {
    try {
        const groupId = Number(req.params.id);

        if (!Number.isSafeInteger(groupId) || groupId <= 0) {
            return res.status(400).json({
                error: "ID de grupo inválido."
            });
        }

        const member = await groupService.joinGroup(
            groupId,
            req.userId
        );

        return res.status(201).json({
            message: "Você entrou no grupo com sucesso.",
            member
        });

    } catch (error) {
        if (error.message === "GROUP_NOT_FOUND") {
            return res.status(404).json({
                error: "Grupo não encontrado."
            });
        }

        if (error.message === "ALREADY_MEMBER") {
            return res.status(409).json({
                error: "Você já participa deste grupo."
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
}
async function leave(req, res) {
    try {
        const groupId = Number(req.params.id);

        if (!Number.isSafeInteger(groupId) || groupId <= 0) {
            return res.status(400).json({
                error: "ID de grupo inválido."
            });
        }

        const result = await groupService.leaveGroup(
            groupId,
            req.userId
        );

        return res.status(200).json(result);

    } catch (error) {
        if (error.message === "GROUP_NOT_FOUND") {
            return res.status(404).json({
                error: "Grupo não encontrado."
            });
        }

        if (error.message === "NOT_GROUP_MEMBER") {
            return res.status(404).json({
                error: "Você não participa deste grupo."
            });
        }

        if (error.message === "OWNER_CANNOT_LEAVE") {
            return res.status(403).json({
                error: "O responsável não pode sair do grupo."
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
}

async function update(req, res) {
    try {
        const groupId = Number(req.params.id);

        if (!Number.isSafeInteger(groupId) || groupId <= 0) {
            return res.status(400).json({
                error: "ID de grupo inválido."
            });
        }

        const group = await groupService.updateGroup(
            groupId,
            req.userId,
            req.body || {}
        );

        return res.status(200).json({
            message: "Grupo atualizado com sucesso.",
            group
        });

    } catch (error) {
        const errors = {
            GROUP_NOT_FOUND: [404, "Grupo não encontrado."],
            NOT_GROUP_OWNER: [403, "Apenas o responsável pode editar o grupo."],
            INVALID_GROUP_NAME: [400, "Informe um nome válido para o grupo."],
            INVALID_DESCRIPTION: [400, "Descrição inválida."],
            NO_FIELDS_TO_UPDATE: [400, "Informe ao menos um campo para atualizar."]
        };

        if (errors[error.message]) {
            const [status, message] = errors[error.message];

            return res.status(status).json({
                error: message
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
}

module.exports = {
    create,
    list,
    getById,
    join,
    leave,
    update
};

