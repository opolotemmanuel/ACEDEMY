require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = global.__aqodhPrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__aqodhPrisma = prisma;
}

module.exports = prisma;
