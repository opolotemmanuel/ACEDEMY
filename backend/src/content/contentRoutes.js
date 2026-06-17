const express = require("express");
const prisma = require("../prisma");

function ok(res, status, data) {
  res.status(status).json({ ok: true, ...data });
}

function fail(res, status, error) {
  res.status(status).json({ ok: false, error });
}

function asyncRoute(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      fail(res, 500, "Request failed");
    }
  };
}

function requireExpressAuth(requireAuth) {
  return async (req, res, next) => {
    const auth = await requireAuth(req, res);
    if (!auth) return;
    req.auth = auth;
    next();
  };
}

function requireContentManager(req, res, next) {
  if (!["ADMIN", "INSTRUCTOR"].includes(req.auth.user.role)) {
    fail(res, 403, "Only admin and instructor users can manage course content");
    return;
  }
  next();
}

function normalizeCourseStatus(status, fallback = "DRAFT") {
  const value = String(status || fallback).toUpperCase();
  return ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(value) ? value : fallback;
}

function normalizeLessonType(type, fallback = "TEXT") {
  const value = String(type || fallback).toUpperCase();
  return ["TEXT", "PDF", "POWERPOINT", "VIDEO", "QUIZ", "ASSIGNMENT"].includes(value) ? value : fallback;
}

function contentRoutes({ requireAuth }) {
  const router = express.Router();
  router.use(express.json({ limit: "1mb" }));
  router.use(requireExpressAuth(requireAuth));

  router.get("/courses", asyncRoute(async (req, res) => {
    const courses = await prisma.course.findMany({
      where: req.auth.user.role === "STUDENT" ? { status: "PUBLISHED" } : {},
      orderBy: { createdAt: "asc" },
      include: {
        modules: {
          orderBy: { moduleOrder: "asc" },
          include: { lessons: { orderBy: { lessonOrder: "asc" } } },
        },
      },
    });
    ok(res, 200, { courses });
  }));

  router.post("/courses", requireContentManager, asyncRoute(async (req, res) => {
    const course = await prisma.course.create({
      data: {
        title: String(req.body.title || "").trim(),
        slug: String(req.body.slug || "").trim().toLowerCase(),
        description: req.body.description ? String(req.body.description) : null,
        level: String(req.body.level || "Beginner"),
        durationWeeks: Number(req.body.durationWeeks || 1),
        price: Number(req.body.price || 0),
        isFree: Boolean(req.body.isFree),
        status: normalizeCourseStatus(req.body.status),
        createdBy: req.auth.user.id,
      },
    });
    ok(res, 201, { course });
  }));

  router.post("/courses/:courseId/modules", requireContentManager, asyncRoute(async (req, res) => {
    const module = await prisma.courseModule.create({
      data: {
        courseId: req.params.courseId,
        title: String(req.body.title || "").trim(),
        description: req.body.description ? String(req.body.description) : null,
        moduleOrder: Number(req.body.moduleOrder || 1),
        status: normalizeCourseStatus(req.body.status),
      },
    });
    ok(res, 201, { module });
  }));

  router.post("/modules/:moduleId/lessons", requireContentManager, asyncRoute(async (req, res) => {
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: req.params.moduleId,
        title: String(req.body.title || "").trim(),
        description: req.body.description ? String(req.body.description) : null,
        lessonType: normalizeLessonType(req.body.lessonType),
        content: req.body.content ? String(req.body.content) : null,
        lessonOrder: Number(req.body.lessonOrder || 1),
        isRequired: req.body.isRequired !== false,
        status: normalizeCourseStatus(req.body.status),
      },
    });
    ok(res, 201, { lesson });
  }));

  return router;
}

module.exports = contentRoutes;
