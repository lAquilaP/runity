const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

async function register({ name, username, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: normalizedEmail },
                { username: normalizedUsername }
            ]
        }
    });

    if (existingUser) {
        if (existingUser.email === normalizedEmail) {
            throw new Error("EMAIL_ALREADY_EXISTS");
        }

        if (existingUser.username === normalizedUsername) {
            throw new Error("USERNAME_ALREADY_EXISTS");
        }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name: name.trim(),
            username: normalizedUsername,
            email: normalizedEmail,
            passwordHash
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            bio: true,
            profileImage: true,
            createdAt: true
        }
    });

    return user;
}

async function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: {
            email: normalizedEmail
        }
    });

    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordMatches) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
        {
            sub: user.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    };
}

module.exports = {
    register,
    login
};