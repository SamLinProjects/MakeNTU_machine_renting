import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const superADMIN = {
    "name": "admin0",
    "password": "0",
    "permission": "admin"
}

const addSuperADMIN = async() => {
    await prisma.account.create({
        data: {
            name: superADMIN.name,
            password: superADMIN.password,
            permission: superADMIN.permission
        }
    })
}

addSuperADMIN();