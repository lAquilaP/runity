const prisma = require("../lib/prisma");

async function getProfile(userId) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            bio: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    return user;
}


async function updateProfile(userId, { name, username, bio }) {
    const data = {};

    if (name !== undefined) {
        const normalizedName = name.trim();

        if (!normalizedName) {
            throw new Error("INVALID_NAME");
        }

        data.name = normalizedName;
    }

    if (username !== undefined) {
        const normalizedUsername = username.trim().toLowerCase();

        if (!normalizedUsername) {
            throw new Error("INVALID_USERNAME");
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                username: normalizedUsername,
                NOT: {
                    id: userId
                }
            }
        });

        if (existingUser) {
            throw new Error("USERNAME_ALREADY_EXISTS");
        }

        data.username = normalizedUsername;
    }

    if (bio !== undefined) {
        data.bio = bio ? bio.trim() : null;
    }

    if (Object.keys(data).length === 0) {
        throw new Error("NO_FIELDS_TO_UPDATE");
    }

    return prisma.user.update({
        where: {
            id: userId
        },
        data,
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            bio: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true
        }
    });
}
async function getPublicProfile(userId) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            profileImage: true,
            createdAt: true
        }
    });

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    return user;
}

module.exports = {
    getProfile,
    updateProfile,
    getPublicProfile
};

