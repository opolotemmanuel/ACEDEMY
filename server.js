require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const prisma = require("./src/lib/prisma");
const { signJwt, verifyJwt, publicUser } = require("./server/auth");
const contentRoutes = require("./backend/src/content/contentRoutes");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const ALLOWED_ORIGINS = String(process.env.ALLOWED_ORIGINS || "http://127.0.0.1:3000,http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const AUTH_RATE_LIMIT_MAX = IS_PRODUCTION ? 10 : 50;
const authRateLimits = new Map();

function corsOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return ALLOWED_ORIGINS[0] || "http://127.0.0.1:3000";
  return ALLOWED_ORIGINS.includes(origin) ? origin : "";
}

function securityHeaders(req) {
  const headers = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
  const origin = corsOrigin(req);
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }
  return headers;
}

function sendJson(req, res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    ...securityHeaders(req),
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });
  });
}

function tokenFromRequest(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function clientIp(req) {
  const forwardedFor = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwardedFor || req.socket.remoteAddress || "unknown";
}

function checkAuthRateLimit(req, pathname) {
  if (!pathname.startsWith("/api/auth/") || req.method === "OPTIONS") return null;
  const key = `${clientIp(req)}:${pathname}`;
  const currentTime = Date.now();
  const bucket = authRateLimits.get(key) || { count: 0, resetAt: currentTime + AUTH_RATE_LIMIT_WINDOW_MS };

  if (bucket.resetAt <= currentTime) {
    bucket.count = 0;
    bucket.resetAt = currentTime + AUTH_RATE_LIMIT_WINDOW_MS;
  }

  bucket.count += 1;
  authRateLimits.set(key, bucket);
  return bucket.count > AUTH_RATE_LIMIT_MAX ? Math.ceil((bucket.resetAt - currentTime) / 1000) : null;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

function validatePassword(password) {
  const minimumLength = IS_PRODUCTION ? 12 : 8;
  return typeof password === "string" && password.length >= minimumLength;
}

function passwordRequirementMessage() {
  return `Password must be at least ${IS_PRODUCTION ? 12 : 8} characters`;
}

function normalizeRole(role, fallback = "STUDENT") {
  const value = String(role || fallback).toUpperCase();
  return ["ADMIN", "INSTRUCTOR", "STUDENT"].includes(value) ? value : fallback;
}

function normalizeUserStatus(status, fallback = "ACTIVE") {
  const value = String(status || fallback).toUpperCase();
  return ["ACTIVE", "PENDING", "SUSPENDED"].includes(value) ? value : fallback;
}

function normalizeCourseStatus(status, fallback = "DRAFT") {
  const value = String(status || fallback).toUpperCase();
  return ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(value) ? value : fallback;
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

async function authenticate(req) {
  const token = tokenFromRequest(req);
  const payload = verifyJwt(token);
  if (!payload) return { error: "Invalid or expired token" };

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || user.status !== "ACTIVE") return { error: "User is not active" };
  return { user, token, tokenHash: hashToken(token) };
}

async function requireAuth(req, res) {
  const auth = await authenticate(req);
  if (auth.error) {
    sendJson(req, res, 401, { error: auth.error });
    return null;
  }
  return auth;
}

async function requireRole(req, res, roles) {
  const auth = await requireAuth(req, res);
  if (!auth) return null;
  if (!roles.includes(auth.user.role)) {
    sendJson(req, res, 403, { error: "Forbidden" });
    return null;
  }
  return auth;
}

async function currentCourse() {
  return prisma.course.findFirst({
    where: { slug: "ethical-computing-fundamentals" },
    include: {
      modules: {
        orderBy: { moduleOrder: "asc" },
        include: { lessons: { orderBy: { lessonOrder: "asc" } } },
      },
    },
  });
}

async function ensureStudentEnrollment(studentId, courseId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.status !== "PUBLISHED") return null;

  const enrollment = await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId, courseId } },
    update: { enrollmentStatus: "ACTIVE" },
    create: { studentId, courseId, enrollmentStatus: "ACTIVE" },
  });

  const progress = await prisma.studentProgress.upsert({
    where: { studentId_courseId: { studentId, courseId } },
    update: {},
    create: { studentId, courseId },
  });

  return { course, enrollment, progress };
}

async function handleApi(req, res, pathname) {
  if (req.method === "OPTIONS") return sendJson(req, res, 204, {});

  try {
    const retryAfter = checkAuthRateLimit(req, pathname);
    if (retryAfter) {
      return sendJson(req, res, 429, { error: "Too many authentication attempts. Try again later.", retryAfter });
    }

    if (pathname === "/api/health" && req.method === "GET") {
      await prisma.$queryRaw`SELECT 1`;
      return sendJson(req, res, 200, { status: "ok", database: "connected" });
    }

    if (pathname === "/api/auth/register" && req.method === "POST") {
      const body = await readBody(req);
      const fullName = String(body.fullName || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!fullName || !validateEmail(email) || !validatePassword(password)) {
        return sendJson(req, res, 400, { error: `Valid fullName, email, and ${IS_PRODUCTION ? "12+" : "8+"} character password are required` });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return sendJson(req, res, 409, { error: "Email already exists" });

      const user = await prisma.user.create({
        data: {
          fullName,
          email,
          passwordHash: await bcrypt.hash(password, 12),
          role: "STUDENT",
          status: "ACTIVE",
          phone: body.phone ? String(body.phone) : "",
          country: body.country ? String(body.country) : "",
          profilePhotoUrl: "",
        },
      });
      const token = signJwt({ sub: user.id, role: user.role });
      return sendJson(req, res, 201, { user: publicUser(user), token });
    }

    if (pathname === "/api/auth/login" && req.method === "POST") {
      const body = await readBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return sendJson(req, res, 401, { error: "Invalid email or password" });
      }
      if (user.status !== "ACTIVE") {
        return sendJson(req, res, 403, { error: `Account is ${user.status.toLowerCase()}` });
      }
      const token = signJwt({ sub: user.id, role: user.role });
      return sendJson(req, res, 200, { user: publicUser(user), token });
    }

    if (pathname === "/api/auth/logout" && req.method === "POST") {
      const auth = await requireAuth(req, res);
      if (!auth) return;
      return sendJson(req, res, 200, { ok: true });
    }

    if (pathname === "/api/auth/me" && req.method === "GET") {
      const auth = await requireAuth(req, res);
      if (!auth) return;
      return sendJson(req, res, 200, { user: publicUser(auth.user) });
    }

    if (pathname === "/api/auth/me" && req.method === "PATCH") {
      const auth = await requireAuth(req, res);
      if (!auth) return;
      const body = await readBody(req);
      const changes = {};
      if (body.fullName) changes.fullName = String(body.fullName).trim();
      if (body.phone !== undefined) changes.phone = String(body.phone);
      if (body.country !== undefined) changes.country = String(body.country);
      const user = await prisma.user.update({ where: { id: auth.user.id }, data: changes });
      return sendJson(req, res, 200, { user: publicUser(user) });
    }

    if (pathname === "/api/auth/change-password" && req.method === "POST") {
      const auth = await requireAuth(req, res);
      if (!auth) return;
      const body = await readBody(req);
      if (!(await bcrypt.compare(String(body.currentPassword || ""), auth.user.passwordHash))) {
        return sendJson(req, res, 400, { error: "Current password is incorrect" });
      }
      if (!validatePassword(body.newPassword)) {
        return sendJson(req, res, 400, { error: passwordRequirementMessage() });
      }
      await prisma.user.update({
        where: { id: auth.user.id },
        data: { passwordHash: await bcrypt.hash(body.newPassword, 12) },
      });
      return sendJson(req, res, 200, { ok: true });
    }

    if (pathname === "/api/auth/forgot-password" && req.method === "POST") {
      return sendJson(req, res, 501, { error: "Password reset delivery is not configured yet" });
    }

    if (pathname === "/api/auth/reset-password" && req.method === "POST") {
      return sendJson(req, res, 501, { error: "Password reset delivery is not configured yet" });
    }

    if (pathname === "/api/users" && req.method === "GET") {
      const auth = await requireRole(req, res, ["ADMIN"]);
      if (!auth) return;
      const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
      return sendJson(req, res, 200, { users: users.map(publicUser) });
    }

    if (pathname === "/api/users" && req.method === "POST") {
      const auth = await requireRole(req, res, ["ADMIN"]);
      if (!auth) return;
      const body = await readBody(req);
      const fullName = String(body.fullName || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!fullName || !validateEmail(email) || !validatePassword(password)) {
        return sendJson(req, res, 400, { error: `Valid fullName, email, and ${IS_PRODUCTION ? "12+" : "8+"} character password are required` });
      }
      const user = await prisma.user.create({
        data: {
          fullName,
          email,
          passwordHash: await bcrypt.hash(password, 12),
          role: normalizeRole(body.role, "INSTRUCTOR"),
          status: normalizeUserStatus(body.status, "PENDING"),
          phone: body.phone ? String(body.phone) : "",
          country: body.country ? String(body.country) : "",
          profilePhotoUrl: "",
        },
      });
      return sendJson(req, res, 201, { user: publicUser(user), createdBy: auth.user.id });
    }

    const userMatch = pathname.match(/^\/api\/users\/([^/]+)$/);
    if (userMatch) {
      const auth = await requireRole(req, res, ["ADMIN"]);
      if (!auth) return;
      const userId = decodeURIComponent(userMatch[1]);
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return sendJson(req, res, 404, { error: "User not found" });

      if (req.method === "GET") return sendJson(req, res, 200, { user: publicUser(user) });
      if (req.method === "PATCH") {
        const body = await readBody(req);
        const changes = {};
        if (body.fullName) changes.fullName = String(body.fullName).trim();
        if (body.phone !== undefined) changes.phone = String(body.phone);
        if (body.country !== undefined) changes.country = String(body.country);
        if (body.role !== undefined) changes.role = normalizeRole(body.role, user.role);
        if (body.status !== undefined) changes.status = normalizeUserStatus(body.status, user.status);
        if (body.password) {
          if (!validatePassword(body.password)) return sendJson(req, res, 400, { error: passwordRequirementMessage() });
          changes.passwordHash = await bcrypt.hash(body.password, 12);
        }
        const updated = await prisma.user.update({ where: { id: user.id }, data: changes });
        return sendJson(req, res, 200, { user: publicUser(updated) });
      }
    }

    if (pathname === "/api/courses/current" && req.method === "GET") {
      const course = await currentCourse();
      if (!course) return sendJson(req, res, 404, { error: "Course not found" });
      return sendJson(req, res, 200, { course });
    }

    if (pathname === "/api/courses" && req.method === "GET") {
      const auth = await requireAuth(req, res);
      if (!auth) return;
      const courses = await prisma.course.findMany({
        where: auth.user.role === "STUDENT" ? { status: "PUBLISHED" } : {},
        orderBy: { createdAt: "asc" },
        include: { modules: { orderBy: { moduleOrder: "asc" } } },
      });
      return sendJson(req, res, 200, { courses });
    }

    if (pathname === "/api/courses" && req.method === "POST") {
      const auth = await requireRole(req, res, ["ADMIN", "INSTRUCTOR"]);
      if (!auth) return;
      const body = await readBody(req);
      const title = String(body.title || "").trim();
      const slug = String(body.slug || "").trim().toLowerCase();
      if (!title || !slug) return sendJson(req, res, 400, { error: "Valid title and slug are required" });
      const course = await prisma.course.create({
        data: {
          title,
          slug,
          description: body.description ? String(body.description) : null,
          level: String(body.level || "Beginner"),
          durationWeeks: Number(body.durationWeeks || 1),
          price: Number(body.price || 0),
          isFree: Boolean(body.isFree),
          status: normalizeCourseStatus(body.status),
          createdBy: auth.user.id,
        },
      });
      return sendJson(req, res, 201, { course });
    }

    if (pathname === "/api/enrollments" && req.method === "POST") {
      const auth = await requireRole(req, res, ["STUDENT"]);
      if (!auth) return;
      const body = await readBody(req);
      const selectedCourse = body.courseId ? await prisma.course.findUnique({ where: { id: String(body.courseId) } }) : await currentCourse();
      if (!selectedCourse) return sendJson(req, res, 404, { error: "Course not found" });
      const enrollmentData = await ensureStudentEnrollment(auth.user.id, selectedCourse.id);
      if (!enrollmentData) return sendJson(req, res, 404, { error: "Published course not found" });
      return sendJson(req, res, 201, enrollmentData);
    }

    if (pathname === "/api/student/learning-state" && req.method === "GET") {
      const auth = await requireRole(req, res, ["STUDENT"]);
      if (!auth) return;
      const course = await currentCourse();
      if (!course) return sendJson(req, res, 404, { error: "Course not found" });
      const enrollmentData = await ensureStudentEnrollment(auth.user.id, course.id);
      return sendJson(req, res, 200, { ...enrollmentData, course });
    }

    if (pathname === "/api/student/learning-state" && req.method === "PATCH") {
      const auth = await requireRole(req, res, ["STUDENT"]);
      if (!auth) return;
      const body = await readBody(req);
      const course = await currentCourse();
      if (!course) return sendJson(req, res, 404, { error: "Course not found" });
      await ensureStudentEnrollment(auth.user.id, course.id);
      const progress = await prisma.studentProgress.update({
        where: { studentId_courseId: { studentId: auth.user.id, courseId: course.id } },
        data: {
          ...(body.currentModuleId !== undefined ? { currentModuleId: body.currentModuleId ? String(body.currentModuleId) : null } : {}),
          ...(body.currentLessonId !== undefined ? { currentLessonId: body.currentLessonId ? String(body.currentLessonId) : null } : {}),
        },
      });
      return sendJson(req, res, 200, { progress });
    }

    if (pathname === "/api/student/dashboard" && req.method === "GET") {
      const auth = await requireRole(req, res, ["STUDENT"]);
      if (!auth) return;
      return sendJson(req, res, 200, { ok: true, dashboard: "student" });
    }

    if (pathname === "/api/instructor/dashboard" && req.method === "GET") {
      const auth = await requireRole(req, res, ["INSTRUCTOR"]);
      if (!auth) return;
      return sendJson(req, res, 200, { ok: true, dashboard: "instructor" });
    }

    if (pathname === "/api/admin/dashboard" && req.method === "GET") {
      const auth = await requireRole(req, res, ["ADMIN"]);
      if (!auth) return;
      return sendJson(req, res, 200, { ok: true, dashboard: "admin" });
    }

    return sendJson(req, res, 404, { error: "API route not found" });
  } catch (error) {
    const message = IS_PRODUCTION ? "Request failed" : error.message || "Request failed";
    return sendJson(req, res, 500, { error: message });
  }
}

function serveStatic(req, res, pathname) {
  const filePath = pathname === "/" ? path.join(ROOT, "index.html") : path.join(ROOT, pathname);
  const normalized = path.normalize(filePath);
  if (!normalized.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.readFile(normalized, (error, content) => {
    if (error) {
      res.writeHead(404);
      return res.end("Not found");
    }
    const ext = path.extname(normalized);
    const types = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".md": "text/markdown",
    };
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream", ...securityHeaders(req) });
    res.end(content);
  });
}

const server = express();

server.use((req, res, next) => {
  const headers = securityHeaders(req);
  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

server.use("/api/content", contentRoutes({ requireAuth }));

server.use((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/")) {
    handleApi(req, res, url.pathname);
    return;
  }
  serveStatic(req, res, url.pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`AQODH Academy server running at http://${HOST}:${PORT}`);
});
