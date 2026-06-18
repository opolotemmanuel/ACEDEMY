const prisma = require("../lib/prisma");
const { verifyJwt } = require("../../server/auth");

function parseCookies(req) {
  return String(req.headers.cookie || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const index = part.indexOf("=");
      if (index === -1) return cookies;
      cookies[decodeURIComponent(part.slice(0, index))] = decodeURIComponent(part.slice(index + 1));
      return cookies;
    }, {});
}

function tokenFromRequest(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return parseCookies(req).aqodh_token || "";
}

async function authenticate(req, res, next) {
  try {
    const token = tokenFromRequest(req);
    const payload = verifyJwt(token);
    if (!payload) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.status !== "ACTIVE") {
      res.status(401).json({ error: "User is not active" });
      return;
    }

    req.user = user;
    req.auth = { user, token };
    next();
  } catch (error) {
    next(error);
  }
}

const requireAuth = authenticate;

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}

module.exports = {
  authenticate,
  requireAuth,
  requireRole,
  tokenFromRequest,
};
