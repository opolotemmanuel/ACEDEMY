const authService = require("./auth.service");
const { publicUser } = require("../../server/auth");

const IS_PRODUCTION = process.env.NODE_ENV === "production";

function authCookie(token) {
  const parts = [
    `aqodh_token=${encodeURIComponent(token)}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Max-Age=28800",
  ];
  if (IS_PRODUCTION) parts.push("Secure");
  return parts.join("; ");
}

function clearAuthCookie() {
  const parts = [
    "aqodh_token=",
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (IS_PRODUCTION) parts.push("Secure");
  return parts.join("; ");
}

async function register(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body || {});
    res.setHeader("Set-Cookie", authCookie(token));
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { user, token } = await authService.login(req.body || {});
    res.setHeader("Set-Cookie", authCookie(token));
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res) {
  res.setHeader("Set-Cookie", clearAuthCookie());
  res.status(200).json({ ok: true });
}

async function me(req, res) {
  res.status(200).json({ user: publicUser(req.user) });
}

module.exports = {
  login,
  logout,
  me,
  register,
};
