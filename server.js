const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { readDb, writeDb, nextId, now } = require("./server/db");
const { hashPassword, verifyPassword, signJwt, verifyJwt, publicUser } = require("./server/auth");
const aiClient = require("./backend/src/ai/aiClient");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;
const DEFAULT_COURSE_ID = "course_ethical_computing_fundamentals";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const ALLOWED_ORIGINS = String(process.env.ALLOWED_ORIGINS || "http://127.0.0.1:3000,http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const AUTH_RATE_LIMIT_MAX = IS_PRODUCTION ? 10 : 50;
const ACCOUNT_LOCK_MAX_FAILURES = 5;
const ACCOUNT_LOCK_MS = 15 * 60 * 1000;
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
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

function authenticate(req) {
  const token = tokenFromRequest(req);
  const payload = verifyJwt(token);
  if (!payload) return { error: "Invalid or expired token" };
  const db = readDb();
  if (db.revokedTokens.includes(token)) return { error: "Token has been revoked" };
  const session = db.authSessions.find((item) => item.tokenHash === hashToken(token));
  if (!session || session.revokedAt || new Date(session.expiresAt).getTime() <= Date.now()) {
    return { error: "Session is invalid or expired" };
  }
  const user = db.users.find((item) => item.id === payload.sub);
  if (!user || user.status !== "ACTIVE") return { error: "User is not active" };
  if (accountLocked(user)) return { error: "Account is temporarily locked" };
  return { db, user, token, session };
}

function requireAuth(req, res) {
  const auth = authenticate(req);
  if (auth.error) {
    sendJson(req, res, 401, { error: auth.error });
    return null;
  }
  return auth;
}

function requireRole(req, res, roles) {
  const auth = requireAuth(req, res);
  if (!auth) return null;
  if (!roles.includes(auth.user.role)) {
    sendJson(req, res, 403, { error: "Forbidden" });
    return null;
  }
  return auth;
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

function updateUser(user, changes) {
  Object.assign(user, changes, { updatedAt: now() });
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

function recordAuthEvent(db, req, type, userId, detail = {}) {
  db.authEvents.push({
    id: nextId("evt"),
    type,
    userId: userId || null,
    detail,
    ipAddress: clientIp(req),
    userAgent: req.headers["user-agent"] || "",
    createdAt: now(),
  });
}

function createSession(db, req, user, token) {
  const session = {
    id: nextId("ses"),
    userId: user.id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
    revokedAt: null,
    ipAddress: clientIp(req),
    userAgent: req.headers["user-agent"] || "",
    createdAt: now(),
  };
  db.authSessions.push(session);
  return session;
}

function revokeSession(db, token) {
  const tokenHash = hashToken(token);
  const session = db.authSessions.find((item) => item.tokenHash === tokenHash);
  if (session && !session.revokedAt) session.revokedAt = now();
  if (!db.revokedTokens.includes(token)) db.revokedTokens.push(token);
}

function revokeUserSessions(db, userId, exceptToken = "") {
  const exceptHash = exceptToken ? hashToken(exceptToken) : "";
  db.authSessions
    .filter((session) => session.userId === userId && !session.revokedAt && session.tokenHash !== exceptHash)
    .forEach((session) => {
      session.revokedAt = now();
    });
}

function accountLocked(user) {
  return user.lockUntil && new Date(user.lockUntil).getTime() > Date.now();
}

function registerFailedLogin(db, req, user, email) {
  if (!user) {
    recordAuthEvent(db, req, "LOGIN_FAILED", null, { email, reason: "unknown_user" });
    return;
  }
  user.failedLoginCount = Number(user.failedLoginCount || 0) + 1;
  if (user.failedLoginCount >= ACCOUNT_LOCK_MAX_FAILURES) {
    user.lockUntil = new Date(Date.now() + ACCOUNT_LOCK_MS).toISOString();
    recordAuthEvent(db, req, "ACCOUNT_LOCKED", user.id, { email: user.email });
  }
  user.updatedAt = now();
  recordAuthEvent(db, req, "LOGIN_FAILED", user.id, { email: user.email });
}

function registerSuccessfulLogin(db, req, user) {
  user.failedLoginCount = 0;
  user.lockUntil = null;
  user.lastLoginAt = now();
  user.updatedAt = now();
  recordAuthEvent(db, req, "LOGIN_SUCCESS", user.id);
}

function createEmailVerification(db, req, user) {
  const token = crypto.randomBytes(24).toString("hex");
  db.emailVerificationTokens.push({
    id: nextId("emv"),
    userId: user.id,
    tokenHash: hashToken(token),
    expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    usedAt: null,
    createdAt: now(),
  });
  recordAuthEvent(db, req, "EMAIL_VERIFICATION_CREATED", user.id);
  return token;
}

function currentCourse(db) {
  return db.courses.find((course) => course.id === DEFAULT_COURSE_ID) || db.courses[0];
}

function moduleActivityKeys(course) {
  return course.modules.flatMap((module, moduleIndex) => [
    ...module.lessons.map((lesson, lessonIndex) => `${moduleIndex}:lesson:${lessonIndex}`),
    `${moduleIndex}:document:0`,
    `${moduleIndex}:document:1`,
    `${moduleIndex}:video:0`,
    `${moduleIndex}:quiz:0`,
    `${moduleIndex}:assignment:0`,
  ]);
}

function calculateProgressPercent(course, completedActivities) {
  const totalActivities = moduleActivityKeys(course).length;
  if (!totalActivities) return 0;
  return Math.min(100, Math.round((completedActivities.length / totalActivities) * 100));
}

function ensureStudentEnrollment(db, userId, courseId = DEFAULT_COURSE_ID) {
  const course = db.courses.find((item) => item.id === courseId);
  if (!course) return null;

  let enrollment = db.enrollments.find((item) => item.userId === userId && item.courseId === course.id);
  if (!enrollment) {
    enrollment = {
      id: nextId("enr"),
      userId,
      courseId: course.id,
      status: "ACTIVE",
      enrolledAt: now(),
      updatedAt: now(),
    };
    db.enrollments.push(enrollment);
  }

  let progress = db.studentProgress.find((item) => item.userId === userId && item.courseId === course.id);
  if (!progress) {
    progress = {
      id: nextId("prg"),
      userId,
      courseId: course.id,
      activeModule: 0,
      activeLesson: 0,
      activeActivity: "lesson:0",
      completedActivities: [],
      progressPercent: 0,
      finalGrade: 0,
      updatedAt: now(),
    };
    db.studentProgress.push(progress);
  }

  let payment = db.payments.find((item) => item.userId === userId && item.courseId === course.id);
  if (!payment) {
    payment = {
      id: nextId("pay"),
      userId,
      courseId: course.id,
      amountUgx: course.isFree ? 0 : course.priceStudentUgx,
      provider: course.isFree ? "FREE_COURSE" : "MANUAL_APPROVAL",
      status: course.isFree ? "FULLY_PAID" : "PENDING_PAYMENT",
      approvedBy: null,
      paidAt: course.isFree ? now() : null,
      createdAt: now(),
      updatedAt: now(),
    };
    db.payments.push(payment);
  }

  progress.progressPercent = calculateProgressPercent(course, progress.completedActivities);
  return { course, enrollment, progress, payment };
}

function certificateEligibility(db, userId, courseId = DEFAULT_COURSE_ID) {
  const course = db.courses.find((item) => item.id === courseId);
  const progress = db.studentProgress.find((item) => item.userId === userId && item.courseId === courseId);
  const payment = db.payments.find((item) => item.userId === userId && item.courseId === courseId);
  const certificate = db.certificates.find((item) => item.userId === userId && item.courseId === courseId && item.status !== "INVALID");
  if (!course || !progress) {
    return { eligible: false, reason: "not_enrolled" };
  }

  const completionOk = progress.progressPercent >= 100;
  const gradeOk = Number(progress.finalGrade || 0) >= course.minimumCertificatePassMark;
  const paymentOk = course.isFree || !course.requireFullPaymentForCertificate || payment?.status === "FULLY_PAID";
  const approvalOk = !course.requireManualCertificateApproval || certificate?.status === "VALID";
  const notRevoked = certificate?.status !== "REVOKED";

  let reason = "eligible";
  if (!completionOk) reason = "progress_incomplete";
  else if (!gradeOk) reason = "grade_too_low";
  else if (!paymentOk) reason = "payment_incomplete";
  else if (!approvalOk) reason = "admin_approval_required";
  else if (!notRevoked) reason = "certificate_revoked";

  return {
    eligible: completionOk && gradeOk && paymentOk && approvalOk && notRevoked,
    reason,
    checks: { completionOk, gradeOk, paymentOk, approvalOk, notRevoked },
  };
}

function certificateNumber(db) {
  const prefix = db.settings?.certificateNumberPrefix || "AQODH-ECF";
  return `${prefix}-${new Date().getFullYear()}-${String(db.certificates.length + 1).padStart(5, "0")}`;
}

function buildAiInsight(id, type, title, summary, recommendation, priority, source) {
  return {
    id,
    insightType: type,
    title,
    summary,
    recommendation,
    priority,
    status: "NEW",
    relatedEntityType: null,
    relatedEntityId: null,
    generatedBy: "RULES_V1",
    source,
    createdAt: now(),
    reviewedAt: null,
    reviewedBy: null,
  };
}

function generateAiInsights(db) {
  const course = currentCourse(db);
  const progressRecords = db.studentProgress || [];
  const pendingPayments = (db.payments || []).filter((payment) => payment.status !== "FULLY_PAID");
  const readyCertificates = progressRecords.filter((progress) => progress.progressPercent >= 100 && Number(progress.finalGrade || 0) >= (course?.minimumCertificatePassMark || 60));
  const riskyProgress = progressRecords.filter((progress) => progress.progressPercent < 30);
  const pendingCertificates = (db.certificates || []).filter((certificate) => certificate.status === "PENDING");

  const generated = [
    buildAiInsight(
      "ai_system_summary",
      "SYSTEM_SUMMARY",
      "Daily System Summary",
      `${db.users.length} users, ${progressRecords.length} progress records, ${pendingPayments.length} pending payment issue, and ${pendingCertificates.length} pending certificate approval.`,
      "Review high-priority queues manually before taking any administrative action.",
      pendingPayments.length || riskyProgress.length ? "HIGH" : "MEDIUM",
      "users, studentProgress, payments, certificates"
    ),
    buildAiInsight(
      "ai_student_risk",
      "STUDENT_RISK",
      "Student Risk Pattern",
      `${riskyProgress.length} enrolled learner record is below 30% progress.`,
      "Instructor should review learner progress and contact students manually where appropriate.",
      riskyProgress.length ? "HIGH" : "LOW",
      "studentProgress.progressPercent"
    ),
    buildAiInsight(
      "ai_payment_risk",
      "PAYMENT_RISK",
      "Payment Risk",
      `${pendingPayments.length} payment record may block course or certificate access.`,
      "Admin should review pending balances and send manual reminders if appropriate.",
      pendingPayments.length ? "HIGH" : "LOW",
      "payments.status"
    ),
    buildAiInsight(
      "ai_certificate_readiness",
      "CERTIFICATE_READINESS",
      "Certificate Readiness",
      `${readyCertificates.length} learner progress record meets completion and grade rules.`,
      "Review certificate eligibility manually. Do not issue certificates automatically.",
      readyCertificates.length ? "HIGH" : "LOW",
      "studentProgress.progressPercent, studentProgress.finalGrade, course.minimumCertificatePassMark"
    ),
    buildAiInsight(
      "ai_course_performance",
      "COURSE_PERFORMANCE",
      "Course Performance Pattern",
      `${course?.modules?.[2]?.title || "Module 3"} remains a likely complexity point for learners.`,
      "Consider adding simpler notes or a short explainer video for difficult concepts.",
      "MEDIUM",
      "course.modules"
    ),
    buildAiInsight(
      "ai_instructor_activity",
      "INSTRUCTOR_ACTIVITY",
      "Instructor Activity",
      "Instructor activity needs review against submissions, lessons, and announcements.",
      "Use instructor reports to manually confirm review time and content updates.",
      "MEDIUM",
      "submissions, lessons, announcements"
    ),
  ];

  for (const insight of generated) {
    const existing = db.aiInsights.find((item) => item.id === insight.id);
    if (existing) {
      Object.assign(existing, {
        insightType: insight.insightType,
        title: insight.title,
        summary: insight.summary,
        recommendation: insight.recommendation,
        priority: insight.priority,
        source: insight.source,
      });
    } else {
      db.aiInsights.push(insight);
    }
  }

  return db.aiInsights;
}

function mergeAiInsights(db, insights, generatedBy = "PYTHON_RULES_V1") {
  const normalized = insights.map((insight) => ({
    id: insight.id,
    insightType: insight.insightType || insight.insight_type,
    title: insight.title,
    summary: insight.summary,
    recommendation: insight.recommendation,
    priority: insight.priority,
    status: insight.status || "NEW",
    relatedEntityType: insight.relatedEntityType || insight.related_entity_type || null,
    relatedEntityId: insight.relatedEntityId || insight.related_entity_id || null,
    generatedBy: insight.generatedBy || insight.generated_by || generatedBy,
    source: insight.source || "Python AI service",
    createdAt: insight.createdAt || insight.created_at || now(),
    reviewedAt: insight.reviewedAt || insight.reviewed_at || null,
    reviewedBy: insight.reviewedBy || insight.reviewed_by || null,
  }));

  for (const insight of normalized) {
    const existing = db.aiInsights.find((item) => item.id === insight.id);
    if (existing) {
      Object.assign(existing, {
        insightType: insight.insightType,
        title: insight.title,
        summary: insight.summary,
        recommendation: insight.recommendation,
        priority: insight.priority,
        source: insight.source,
        generatedBy: insight.generatedBy,
      });
    } else {
      db.aiInsights.push(insight);
    }
  }

  return db.aiInsights;
}

async function generateAiInsightsHybrid(db) {
  try {
    const response = await aiClient.generateInsights(db);
    return mergeAiInsights(db, response.insights || [], "PYTHON_RULES_V1");
  } catch (error) {
    const insights = generateAiInsights(db);
    db.aiSuggestionLogs.push({
      id: nextId("ailog"),
      insightId: null,
      adminId: null,
      action: "AI_SERVICE_FALLBACK",
      notes: `Python AI service unavailable; used Node rules fallback. ${error.message}`,
      createdAt: now(),
    });
    return insights;
  }
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

  if (bucket.count > AUTH_RATE_LIMIT_MAX) {
    return Math.ceil((bucket.resetAt - currentTime) / 1000);
  }

  return null;
}

async function handleApi(req, res, pathname) {
  if (req.method === "OPTIONS") return sendJson(req, res, 204, {});

  try {
    const retryAfter = checkAuthRateLimit(req, pathname);
    if (retryAfter) {
      return sendJson(req, res, 429, { error: "Too many authentication attempts. Try again later.", retryAfter });
    }

    if (pathname === "/api/auth/register" && req.method === "POST") {
      const body = await readBody(req);
      const fullName = String(body.fullName || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!fullName || !validateEmail(email) || !validatePassword(password)) {
        return sendJson(req, res, 400, { error: `Valid fullName, email, and ${IS_PRODUCTION ? "12+" : "8+"} character password are required` });
      }
      const db = readDb();
      if (db.users.some((user) => user.email.toLowerCase() === email)) {
        return sendJson(req, res, 409, { error: "Email already exists" });
      }
      const user = {
        id: nextId("usr"),
        fullName,
        email,
        passwordHash: hashPassword(password),
        role: "student",
        status: "ACTIVE",
        phone: "",
        profilePhotoUrl: "",
        emailVerifiedAt: null,
        failedLoginCount: 0,
        lockUntil: null,
        createdAt: now(),
        updatedAt: now(),
      };
      db.users.push(user);
      const verificationToken = user.emailVerifiedAt ? "" : createEmailVerification(db, req, user);
      recordAuthEvent(db, req, "REGISTER", user.id);
      const token = signJwt({ sub: user.id, role: user.role });
      createSession(db, req, user, token);
      writeDb(db);
      return sendJson(req, res, 201, {
        user: publicUser(user),
        token,
        ...(verificationToken && !IS_PRODUCTION ? { verificationToken, delivery: "development-response-only" } : {}),
      });
    }

    if (pathname === "/api/auth/login" && req.method === "POST") {
      const body = await readBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const db = readDb();
      const user = db.users.find((item) => item.email.toLowerCase() === email);
      if (!user || !verifyPassword(password, user.passwordHash)) {
        registerFailedLogin(db, req, user, email);
        writeDb(db);
        return sendJson(req, res, 401, { error: "Invalid email or password" });
      }
      if (accountLocked(user)) {
        recordAuthEvent(db, req, "LOGIN_BLOCKED_LOCKED", user.id);
        writeDb(db);
        return sendJson(req, res, 423, { error: "Account is temporarily locked. Try again later." });
      }
      if (user.status !== "ACTIVE") {
        recordAuthEvent(db, req, "LOGIN_BLOCKED_STATUS", user.id, { status: user.status });
        writeDb(db);
        return sendJson(req, res, 403, { error: `Account is ${user.status.toLowerCase()}` });
      }
      registerSuccessfulLogin(db, req, user);
      const token = signJwt({ sub: user.id, role: user.role });
      createSession(db, req, user, token);
      writeDb(db);
      return sendJson(req, res, 200, { user: publicUser(user), token });
    }

    if (pathname === "/api/auth/logout" && req.method === "POST") {
      const auth = requireAuth(req, res);
      if (!auth) return;
      revokeSession(auth.db, auth.token);
      recordAuthEvent(auth.db, req, "LOGOUT", auth.user.id);
      writeDb(auth.db);
      return sendJson(req, res, 200, { ok: true });
    }

    if (pathname === "/api/auth/me" && req.method === "GET") {
      const auth = requireAuth(req, res);
      if (!auth) return;
      return sendJson(req, res, 200, { user: publicUser(auth.user) });
    }

    if (pathname === "/api/auth/me" && req.method === "PATCH") {
      const auth = requireAuth(req, res);
      if (!auth) return;
      const body = await readBody(req);
      const changes = {};
      if (body.fullName) changes.fullName = String(body.fullName).trim();
      if (body.phone !== undefined) changes.phone = String(body.phone);
      updateUser(auth.user, changes);
      recordAuthEvent(auth.db, req, "PROFILE_UPDATED", auth.user.id, { fields: Object.keys(changes) });
      writeDb(auth.db);
      return sendJson(req, res, 200, { user: publicUser(auth.user) });
    }

    if (pathname === "/api/auth/change-password" && req.method === "POST") {
      const auth = requireAuth(req, res);
      if (!auth) return;
      const body = await readBody(req);
      if (!verifyPassword(String(body.currentPassword || ""), auth.user.passwordHash)) {
        return sendJson(req, res, 400, { error: "Current password is incorrect" });
      }
      if (!validatePassword(body.newPassword)) {
        return sendJson(req, res, 400, { error: passwordRequirementMessage() });
      }
      updateUser(auth.user, { passwordHash: hashPassword(body.newPassword), failedLoginCount: 0, lockUntil: null });
      revokeUserSessions(auth.db, auth.user.id, auth.token);
      recordAuthEvent(auth.db, req, "PASSWORD_CHANGED", auth.user.id);
      writeDb(auth.db);
      return sendJson(req, res, 200, { ok: true });
    }

    if (pathname === "/api/auth/forgot-password" && req.method === "POST") {
      const body = await readBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      if (IS_PRODUCTION) {
        return sendJson(req, res, 501, { error: "Password reset email delivery is not configured" });
      }
      const db = readDb();
      const user = db.users.find((item) => item.email.toLowerCase() === email);
      if (user) {
        const resetToken = crypto.randomBytes(24).toString("hex");
        db.passwordResets.push({
          userId: user.id,
          tokenHash: hashToken(resetToken),
          expiresAt: Date.now() + 1000 * 60 * 30,
          usedAt: null,
          createdAt: now(),
        });
        recordAuthEvent(db, req, "PASSWORD_RESET_REQUESTED", user.id);
        writeDb(db);
        return sendJson(req, res, 200, { ok: true, resetToken, delivery: "development-response-only" });
      }
      recordAuthEvent(db, req, "PASSWORD_RESET_REQUESTED_UNKNOWN", null, { email });
      writeDb(db);
      return sendJson(req, res, 200, { ok: true });
    }

    if (pathname === "/api/auth/resend-verification" && req.method === "POST") {
      const auth = requireAuth(req, res);
      if (!auth) return;
      if (auth.user.emailVerifiedAt) return sendJson(req, res, 200, { ok: true, alreadyVerified: true });
      if (IS_PRODUCTION) {
        return sendJson(req, res, 501, { error: "Email verification delivery is not configured" });
      }
      const verificationToken = createEmailVerification(auth.db, req, auth.user);
      writeDb(auth.db);
      return sendJson(req, res, 200, { ok: true, verificationToken, delivery: "development-response-only" });
    }

    if (pathname === "/api/auth/verify-email" && req.method === "POST") {
      const body = await readBody(req);
      const tokenHash = hashToken(body.token || "");
      const db = readDb();
      const verification = db.emailVerificationTokens.find((item) => item.tokenHash === tokenHash && !item.usedAt && item.expiresAt > Date.now());
      if (!verification) return sendJson(req, res, 400, { error: "Invalid or expired verification token" });
      const user = db.users.find((item) => item.id === verification.userId);
      if (!user) return sendJson(req, res, 404, { error: "User not found" });
      user.emailVerifiedAt = now();
      user.updatedAt = now();
      verification.usedAt = now();
      recordAuthEvent(db, req, "EMAIL_VERIFIED", user.id);
      writeDb(db);
      return sendJson(req, res, 200, { user: publicUser(user) });
    }

    if (pathname === "/api/auth/reset-password" && req.method === "POST") {
      const body = await readBody(req);
      if (!validatePassword(body.password)) {
        return sendJson(req, res, 400, { error: passwordRequirementMessage() });
      }
      const tokenHash = hashToken(body.token || "");
      const db = readDb();
      const reset = db.passwordResets.find((item) => item.tokenHash === tokenHash && !item.usedAt && item.expiresAt > Date.now());
      if (!reset) return sendJson(req, res, 400, { error: "Invalid or expired reset token" });
      const user = db.users.find((item) => item.id === reset.userId);
      if (!user) return sendJson(req, res, 404, { error: "User not found" });
      updateUser(user, { passwordHash: hashPassword(body.password), failedLoginCount: 0, lockUntil: null });
      reset.usedAt = now();
      revokeUserSessions(db, user.id);
      recordAuthEvent(db, req, "PASSWORD_RESET_COMPLETED", user.id);
      writeDb(db);
      return sendJson(req, res, 200, { ok: true });
    }

    if (pathname === "/api/users" && req.method === "GET") {
      const auth = requireRole(req, res, ["admin"]);
      if (!auth) return;
      return sendJson(req, res, 200, { users: auth.db.users.map(publicUser) });
    }

    if (pathname === "/api/users" && req.method === "POST") {
      const auth = requireRole(req, res, ["admin"]);
      if (!auth) return;
      const body = await readBody(req);
      const fullName = String(body.fullName || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const role = String(body.role || "instructor").toLowerCase();
      const password = String(body.password || "");
      const status = String(body.status || "PENDING").toUpperCase();
      if (!fullName || !validateEmail(email) || !["student", "instructor", "admin"].includes(role) || !validatePassword(password)) {
        return sendJson(req, res, 400, { error: `Valid fullName, email, role, and ${IS_PRODUCTION ? "12+" : "8+"} character password are required` });
      }
      if (!["ACTIVE", "PENDING", "SUSPENDED"].includes(status)) {
        return sendJson(req, res, 400, { error: "Valid status is required" });
      }
      if (auth.db.users.some((user) => user.email.toLowerCase() === email)) {
        return sendJson(req, res, 409, { error: "Email already exists" });
      }
      const user = {
        id: nextId("usr"),
        fullName,
        email,
        passwordHash: hashPassword(password),
        role,
        status,
        phone: body.phone || "",
        profilePhotoUrl: "",
        emailVerifiedAt: body.emailVerified === false ? null : now(),
        failedLoginCount: 0,
        lockUntil: null,
        createdAt: now(),
        updatedAt: now(),
      };
      auth.db.users.push(user);
      recordAuthEvent(auth.db, req, "ADMIN_USER_CREATED", user.id, { createdBy: auth.user.id, role, status });
      writeDb(auth.db);
      return sendJson(req, res, 201, { user: publicUser(user) });
    }

    const userMatch = pathname.match(/^\/api\/users\/([^/]+)(?:\/status)?$/);
    if (userMatch) {
      const auth = requireRole(req, res, ["admin"]);
      if (!auth) return;
      const user = auth.db.users.find((item) => item.id === userMatch[1]);
      if (!user) return sendJson(req, res, 404, { error: "User not found" });

      if (req.method === "GET") return sendJson(req, res, 200, { user: publicUser(user) });
      if (req.method === "DELETE") {
        auth.db.users = auth.db.users.filter((item) => item.id !== user.id);
        revokeUserSessions(auth.db, user.id);
        recordAuthEvent(auth.db, req, "ADMIN_USER_DELETED", user.id, { deletedBy: auth.user.id });
        writeDb(auth.db);
        return sendJson(req, res, 200, { ok: true });
      }
      if (req.method === "PATCH") {
        const body = await readBody(req);
        const allowedStatuses = ["ACTIVE", "PENDING", "SUSPENDED"];
        const allowedRoles = ["student", "instructor", "admin"];
        const changes = {};
        if (body.fullName) changes.fullName = String(body.fullName).trim();
        if (body.phone !== undefined) changes.phone = String(body.phone);
        if (body.status && allowedStatuses.includes(body.status)) changes.status = body.status;
        if (body.role && allowedRoles.includes(body.role)) changes.role = body.role;
        if (body.emailVerified === true) changes.emailVerifiedAt = user.emailVerifiedAt || now();
        if (body.emailVerified === false) changes.emailVerifiedAt = null;
        if (body.locked === false) {
          changes.failedLoginCount = 0;
          changes.lockUntil = null;
        }
        if (body.password) {
          if (!validatePassword(body.password)) return sendJson(req, res, 400, { error: passwordRequirementMessage() });
          changes.passwordHash = hashPassword(body.password);
          changes.failedLoginCount = 0;
          changes.lockUntil = null;
          revokeUserSessions(auth.db, user.id);
        }
        updateUser(user, changes);
        recordAuthEvent(auth.db, req, "ADMIN_USER_UPDATED", user.id, { updatedBy: auth.user.id, fields: Object.keys(changes) });
        writeDb(auth.db);
        return sendJson(req, res, 200, { user: publicUser(user) });
      }
    }

    if (pathname === "/api/admin/auth-events" && req.method === "GET") {
      const auth = requireRole(req, res, ["admin"]);
      if (!auth) return;
      const events = auth.db.authEvents.slice(-100).reverse().map((event) => ({
        ...event,
        user: event.userId ? publicUser(auth.db.users.find((user) => user.id === event.userId)) : null,
      }));
      const sessions = auth.db.authSessions.slice(-100).reverse().map((session) => ({
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
        revokedAt: session.revokedAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        createdAt: session.createdAt,
        user: publicUser(auth.db.users.find((user) => user.id === session.userId)),
      }));
      return sendJson(req, res, 200, { events, sessions });
    }

    if (pathname === "/api/admin/ai/generate" && req.method === "POST") {
      const auth = requireRole(req, res, ["admin"]);
      if (!auth) return;
      const insights = await generateAiInsightsHybrid(auth.db);
      auth.db.aiSuggestionLogs.push({
        id: nextId("ailog"),
        insightId: null,
        adminId: auth.user.id,
        action: "GENERATED",
        notes: "Rules-based V1 AI insights generated. No operational records were changed.",
        createdAt: now(),
      });
      writeDb(auth.db);
      return sendJson(req, res, 201, { insights });
    }

    if (pathname === "/api/admin/ai/summary" && req.method === "GET") {
      const auth = requireRole(req, res, ["admin"]);
      if (!auth) return;
      const insights = auth.db.aiInsights.length ? auth.db.aiInsights : await generateAiInsightsHybrid(auth.db);
      writeDb(auth.db);
      return sendJson(req, res, 200, {
        summary: insights.find((insight) => insight.insightType === "SYSTEM_SUMMARY") || null,
        counts: {
          total: insights.length,
          new: insights.filter((insight) => insight.status === "NEW").length,
          reviewed: insights.filter((insight) => insight.status === "REVIEWED").length,
          dismissed: insights.filter((insight) => insight.status === "DISMISSED").length,
        },
      });
    }

    if (pathname === "/api/admin/ai/insights" && req.method === "GET") {
      const auth = requireRole(req, res, ["admin"]);
      if (!auth) return;
      const insights = auth.db.aiInsights.length ? auth.db.aiInsights : await generateAiInsightsHybrid(auth.db);
      writeDb(auth.db);
      return sendJson(req, res, 200, { insights });
    }

    const aiInsightMatch = pathname.match(/^\/api\/admin\/ai\/insights\/([^/]+)(?:\/(review|dismiss))?$/);
    if (aiInsightMatch) {
      const auth = requireRole(req, res, ["admin"]);
      if (!auth) return;
      const insight = auth.db.aiInsights.find((item) => item.id === aiInsightMatch[1]);
      if (!insight) return sendJson(req, res, 404, { error: "AI insight not found" });
      if (req.method === "GET" && !aiInsightMatch[2]) {
        return sendJson(req, res, 200, { insight });
      }
      if (req.method === "PATCH" && aiInsightMatch[2]) {
        const action = aiInsightMatch[2] === "review" ? "REVIEWED" : "DISMISSED";
        insight.status = action;
        insight.reviewedAt = now();
        insight.reviewedBy = auth.user.id;
        auth.db.aiSuggestionLogs.push({
          id: nextId("ailog"),
          insightId: insight.id,
          adminId: auth.user.id,
          action,
          notes: "Admin updated advisory AI insight status. No operational records were changed.",
          createdAt: now(),
        });
        writeDb(auth.db);
        return sendJson(req, res, 200, { insight });
      }
    }

    if (pathname === "/api/courses/current" && req.method === "GET") {
      const db = readDb();
      const course = currentCourse(db);
      if (!course) return sendJson(req, res, 404, { error: "Course not found" });
      return sendJson(req, res, 200, { course });
    }

    if (pathname === "/api/enrollments" && req.method === "POST") {
      const auth = requireRole(req, res, ["student"]);
      if (!auth) return;
      const body = await readBody(req);
      const enrollmentData = ensureStudentEnrollment(auth.db, auth.user.id, body.courseId || DEFAULT_COURSE_ID);
      if (!enrollmentData) return sendJson(req, res, 404, { error: "Course not found" });
      writeDb(auth.db);
      return sendJson(req, res, 201, {
        enrollment: enrollmentData.enrollment,
        progress: enrollmentData.progress,
        payment: enrollmentData.payment,
        eligibility: certificateEligibility(auth.db, auth.user.id, enrollmentData.course.id),
      });
    }

    if (pathname === "/api/student/learning-state" && req.method === "GET") {
      const auth = requireRole(req, res, ["student"]);
      if (!auth) return;
      const enrollmentData = ensureStudentEnrollment(auth.db, auth.user.id);
      if (!enrollmentData) return sendJson(req, res, 404, { error: "Course not found" });
      writeDb(auth.db);
      return sendJson(req, res, 200, {
        course: enrollmentData.course,
        enrollment: enrollmentData.enrollment,
        progress: enrollmentData.progress,
        payment: enrollmentData.payment,
        certificate: auth.db.certificates.find((item) => item.userId === auth.user.id && item.courseId === enrollmentData.course.id) || null,
        eligibility: certificateEligibility(auth.db, auth.user.id, enrollmentData.course.id),
      });
    }

    if (pathname === "/api/student/learning-state" && req.method === "PATCH") {
      const auth = requireRole(req, res, ["student"]);
      if (!auth) return;
      const body = await readBody(req);
      const enrollmentData = ensureStudentEnrollment(auth.db, auth.user.id);
      if (!enrollmentData) return sendJson(req, res, 404, { error: "Course not found" });
      const progress = enrollmentData.progress;
      if (Number.isInteger(body.activeModule)) progress.activeModule = Math.max(0, Math.min(body.activeModule, enrollmentData.course.modules.length - 1));
      if (Number.isInteger(body.activeLesson)) progress.activeLesson = Math.max(0, body.activeLesson);
      if (typeof body.activeActivity === "string") progress.activeActivity = body.activeActivity;
      progress.updatedAt = now();
      writeDb(auth.db);
      return sendJson(req, res, 200, { progress });
    }

    if (pathname === "/api/student/activities/complete" && req.method === "POST") {
      const auth = requireRole(req, res, ["student"]);
      if (!auth) return;
      const body = await readBody(req);
      const enrollmentData = ensureStudentEnrollment(auth.db, auth.user.id);
      if (!enrollmentData) return sendJson(req, res, 404, { error: "Course not found" });
      const progress = enrollmentData.progress;
      const activityKey = String(body.activityKey || `${progress.activeModule}:${progress.activeActivity}`);
      const validKeys = moduleActivityKeys(enrollmentData.course);
      if (!validKeys.includes(activityKey)) return sendJson(req, res, 400, { error: "Invalid activity key" });
      if (!progress.completedActivities.includes(activityKey)) progress.completedActivities.push(activityKey);
      progress.progressPercent = calculateProgressPercent(enrollmentData.course, progress.completedActivities);
      if (progress.progressPercent >= 100 && Number(progress.finalGrade || 0) === 0) {
        progress.finalGrade = 78;
      }
      progress.updatedAt = now();
      writeDb(auth.db);
      return sendJson(req, res, 200, {
        progress,
        eligibility: certificateEligibility(auth.db, auth.user.id, enrollmentData.course.id),
      });
    }

    if (pathname === "/api/admin/payments" && req.method === "GET") {
      const auth = requireRole(req, res, ["admin"]);
      if (!auth) return;
      const payments = auth.db.payments.map((payment) => ({
        ...payment,
        user: publicUser(auth.db.users.find((user) => user.id === payment.userId)),
        course: auth.db.courses.find((course) => course.id === payment.courseId) || null,
      }));
      return sendJson(req, res, 200, { payments });
    }

    const paymentMatch = pathname.match(/^\/api\/admin\/payments\/([^/]+)$/);
    if (paymentMatch && req.method === "PATCH") {
      const auth = requireRole(req, res, ["admin"]);
      if (!auth) return;
      const body = await readBody(req);
      const payment = auth.db.payments.find((item) => item.id === paymentMatch[1]);
      if (!payment) return sendJson(req, res, 404, { error: "Payment not found" });
      const action = String(body.action || "");
      if (action === "approve") {
        payment.status = "FULLY_PAID";
        payment.approvedBy = auth.user.id;
        payment.paidAt = now();
      } else if (action === "mark-pending") {
        payment.status = "PENDING_PAYMENT";
        payment.approvedBy = null;
        payment.paidAt = null;
      } else {
        return sendJson(req, res, 400, { error: "Valid payment action is required" });
      }
      payment.updatedAt = now();
      writeDb(auth.db);
      return sendJson(req, res, 200, { payment });
    }

    if (pathname === "/api/certificates/generate" && req.method === "POST") {
      const auth = requireRole(req, res, ["student"]);
      if (!auth) return;
      const enrollmentData = ensureStudentEnrollment(auth.db, auth.user.id);
      if (!enrollmentData) return sendJson(req, res, 404, { error: "Course not found" });
      const eligibility = certificateEligibility(auth.db, auth.user.id, enrollmentData.course.id);
      const baseChecksOk = eligibility.checks.completionOk && eligibility.checks.gradeOk && eligibility.checks.paymentOk && eligibility.checks.notRevoked;
      if (!baseChecksOk) return sendJson(req, res, 403, { error: "Certificate requirements are not met", eligibility });

      let certificate = auth.db.certificates.find((item) => item.userId === auth.user.id && item.courseId === enrollmentData.course.id);
      if (!certificate) {
        certificate = {
          id: nextId("cert"),
          userId: auth.user.id,
          courseId: enrollmentData.course.id,
          certificateNumber: certificateNumber(auth.db),
          finalGrade: enrollmentData.progress.finalGrade,
          status: enrollmentData.course.requireManualCertificateApproval ? "PENDING" : "VALID",
          verificationUrl: "",
          approvedBy: null,
          revokedBy: null,
          revokedAt: null,
          issuedAt: enrollmentData.course.requireManualCertificateApproval ? null : now(),
          createdAt: now(),
          updatedAt: now(),
        };
        certificate.verificationUrl = `/certificates/verify/${certificate.certificateNumber}`;
        auth.db.certificates.push(certificate);
      }
      writeDb(auth.db);
      return sendJson(req, res, 201, { certificate, eligibility: certificateEligibility(auth.db, auth.user.id, enrollmentData.course.id) });
    }

    const verifyMatch = pathname.match(/^\/api\/certificates\/verify\/([^/]+)$/);
    if (verifyMatch && req.method === "GET") {
      const db = readDb();
      const certificateNo = decodeURIComponent(verifyMatch[1]);
      const certificate = db.certificates.find((item) => item.certificateNumber === certificateNo);
      const status = certificate ? certificate.status : "INVALID";
      db.certificateVerificationLogs.push({
        id: nextId("ver"),
        certificateNumber: certificateNo,
        certificateId: certificate?.id || null,
        status,
        checkedAt: now(),
        ipAddress: clientIp(req),
        userAgent: req.headers["user-agent"] || "",
      });
      writeDb(db);
      return sendJson(req, res, 200, {
        status,
        certificate: certificate || null,
        user: certificate ? publicUser(db.users.find((user) => user.id === certificate.userId)) : null,
        course: certificate ? db.courses.find((course) => course.id === certificate.courseId) || null : null,
      });
    }

    if (pathname === "/api/admin/certificates" && req.method === "GET") {
      const auth = requireRole(req, res, ["admin"]);
      if (!auth) return;
      const certificates = auth.db.certificates.map((certificate) => ({
        ...certificate,
        user: publicUser(auth.db.users.find((user) => user.id === certificate.userId)),
        course: auth.db.courses.find((course) => course.id === certificate.courseId) || null,
      }));
      return sendJson(req, res, 200, { certificates, verificationLogs: auth.db.certificateVerificationLogs });
    }

    const certificateMatch = pathname.match(/^\/api\/admin\/certificates\/([^/]+)$/);
    if (certificateMatch && req.method === "PATCH") {
      const auth = requireRole(req, res, ["admin"]);
      if (!auth) return;
      const body = await readBody(req);
      const certificate = auth.db.certificates.find((item) => item.id === certificateMatch[1]);
      if (!certificate) return sendJson(req, res, 404, { error: "Certificate not found" });
      const action = String(body.action || "");
      if (action === "approve") {
        certificate.status = "VALID";
        certificate.approvedBy = auth.user.id;
        certificate.issuedAt = certificate.issuedAt || now();
      } else if (action === "revoke") {
        certificate.status = "REVOKED";
        certificate.revokedBy = auth.user.id;
        certificate.revokedAt = now();
      } else if (action === "regenerate") {
        certificate.status = "PENDING";
        certificate.certificateNumber = certificateNumber(auth.db);
        certificate.verificationUrl = `/certificates/verify/${certificate.certificateNumber}`;
        certificate.approvedBy = null;
        certificate.revokedBy = null;
        certificate.revokedAt = null;
        certificate.issuedAt = null;
      } else {
        return sendJson(req, res, 400, { error: "Valid certificate action is required" });
      }
      certificate.updatedAt = now();
      writeDb(auth.db);
      return sendJson(req, res, 200, { certificate });
    }

    if (pathname === "/api/student/dashboard" && req.method === "GET") {
      const auth = requireRole(req, res, ["student"]);
      if (!auth) return;
      return sendJson(req, res, 200, { ok: true, dashboard: "student" });
    }
    if (pathname === "/api/instructor/dashboard" && req.method === "GET") {
      const auth = requireRole(req, res, ["instructor"]);
      if (!auth) return;
      return sendJson(req, res, 200, { ok: true, dashboard: "instructor" });
    }
    if (pathname === "/api/admin/dashboard" && req.method === "GET") {
      const auth = requireRole(req, res, ["admin"]);
      if (!auth) return;
      return sendJson(req, res, 200, { ok: true, dashboard: "admin" });
    }

    return sendJson(req, res, 404, { error: "API route not found" });
  } catch (error) {
    if (!IS_PRODUCTION) {
      return sendJson(req, res, 400, { error: error.message || "Request failed" });
    }
    return sendJson(req, res, 400, { error: "Request failed" });
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

const server = http.createServer((req, res) => {
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
