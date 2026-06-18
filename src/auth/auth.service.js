const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");
const { publicUser, signJwt } = require("../../server/auth");

function normalizeRole(role, fallback = "STUDENT") {
  const value = String(role || fallback).toUpperCase();
  return ["ADMIN", "INSTRUCTOR", "STUDENT"].includes(value) ? value : fallback;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

async function register({ fullName, email, password, role }) {
  const normalizedName = String(fullName || "").trim();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedRole = normalizeRole(role);

  if (!normalizedName || !validateEmail(normalizedEmail) || !validatePassword(password)) {
    const error = new Error("Valid fullName, email, and 8+ character password are required");
    error.statusCode = 400;
    throw error;
  }

  if (normalizedRole !== "STUDENT") {
    const error = new Error("Public registration is limited to student accounts");
    error.statusCode = 403;
    throw error;
  }

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  const user = await prisma.user.create({
    data: {
      fullName: normalizedName,
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
      role: normalizedRole,
      status: "ACTIVE",
      phone: "",
      country: "",
      profilePhotoUrl: "",
    },
  });

  return { user: publicUser(user), token: signJwt({ sub: user.id, role: user.role }) };
}

async function login({ email, password }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!validateEmail(normalizedEmail) || typeof password !== "string" || !password) {
    const error = new Error("Valid email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user || !(await bcrypt.compare(String(password || ""), user.passwordHash))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (user.status !== "ACTIVE") {
    const error = new Error(`Account is ${user.status.toLowerCase()}`);
    error.statusCode = 403;
    throw error;
  }

  return { user: publicUser(user), token: signJwt({ sub: user.id, role: user.role }) };
}

async function currentUser(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.status !== "ACTIVE") {
    const error = new Error("User is not active");
    error.statusCode = 401;
    throw error;
  }
  return publicUser(user);
}

module.exports = {
  currentUser,
  login,
  normalizeRole,
  register,
};
