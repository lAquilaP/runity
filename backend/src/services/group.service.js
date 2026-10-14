
const prisma = require("../lib/prisma");

async function createGroup(userId, { name, description }) {
    if (typeof name !== "string" || !name.trim()) {
        throw new Error("INVALID_GROUP_NAME");
    }

    if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string"
    ) {
        throw new Error("INVALID_DESCRIPTION");
    }

    return prisma.group.create({
        data: {
            name: name.trim(),
            description: description?.trim() || null,
            creatorId: userId,
            members: {
                create: {
                    userId,
                    role: "OWNER"
                }
            }
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            },
            members: {
                select: {
                    userId: true,
                    role: true
                }
            }
        }
    });
}
async function listGroups() {
    return prisma.group.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            image: true,
            createdAt: true,
            creator: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            },
            _count: {
                select: {
                    members: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}

async function getGroupById(groupId) {
    const group = await prisma.group.findUnique({
        where: {
            id: groupId
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            },
            members: {
                select: {
                    role: true,
                    joinedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            profileImage: true
                        }
                    }
                }
            }
        }
    });

    if (!group) {
        throw new Error("GROUP_NOT_FOUND");
    }

    return group;
}
async function joinGroup(groupId, userId) {
    const group = await prisma.group.findUnique({
        where: { id: groupId },
        select: { id: true }
    });

    if (!group) {
        throw new Error("GROUP_NOT_FOUND");
    }

    const existingMember = await prisma.groupMember.findUnique({
        where: {
            userId_groupId: { userId, groupId }
        }
    });

    if (existingMember) {
        throw new Error("ALREADY_MEMBER");
    }

    try {
        return await prisma.groupMember.create({
            data: {
                userId,
                groupId,
                role: "MEMBER"
            },
            select: {
                id: true,
                role: true,
                joinedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                }
            }
        });
    } catch (error) {
        if (error.code === "P2002") {
            throw new Error("ALREADY_MEMBER");
        }
        throw error;
    }
}

async function leaveGroup(groupId, userId) {
    const member = await prisma.groupMember.findUnique({
        where: {
            userId_groupId: { userId, groupId }
        }
    });

    if (!member) {
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            select: { id: true }
        });

        if (!group) {
            throw new Error("GROUP_NOT_FOUND");
        }

        throw new Error("NOT_GROUP_MEMBER");
    }

    if (member.role === "OWNER") {
        throw new Error("OWNER_CANNOT_LEAVE");
    }

    await prisma.groupMember.delete({
        where: {
            userId_groupId: { userId, groupId }
        }
    });

    return {
        message: "Você saiu do grupo com sucesso."
    };
}

async function updateGroup(groupId, userId, { name, description }) {
    const group = await prisma.group.findUnique({
        where: { id: groupId }
    });

    if (!group) {
        throw new Error("GROUP_NOT_FOUND");
    }

    const member = await prisma.groupMember.findUnique({
        where: {
            userId_groupId: { userId, groupId }
        }
    });

    if (!member || member.role !== "OWNER") {
        throw new Error("NOT_GROUP_OWNER");
    }

    const data = {};

    if (name !== undefined) {
        if (typeof name !== "string" || !name.trim()) {
            throw new Error("INVALID_GROUP_NAME");
        }

        data.name = name.trim();
    }

    if (description !== undefined) {
        if (description !== null && typeof description !== "string") {
            throw new Error("INVALID_DESCRIPTION");
        }

        data.description = description?.trim() || null;
    }

    if (Object.keys(data).length === 0) {
        throw new Error("NO_FIELDS_TO_UPDATE");
    }

    return prisma.group.update({
        where: { id: groupId },
        data
    });
}
module.exports = {
    createGroup,
    listGroups,
    getGroupById,
    joinGroup,
    leaveGroup,
    updateGroup
};

