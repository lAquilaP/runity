const prisma = require("../src/lib/prisma");

async function main() {
    const users = await prisma.user.findMany();

    console.log("Conexão com o banco funcionando!");
    console.log("Usuários cadastrados:", users.length);
}

main()
    .catch((error) => {
        console.error("Erro ao conectar com o banco:");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });