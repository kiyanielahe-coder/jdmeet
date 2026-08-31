const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authorization = req.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "احراز هویت الزامی است.",
    });
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "نشست شما نامعتبر یا منقضی شده است.",
    });
  }
}

function authorizeRoles(...allowedRoles) {
  const allowed = new Set(allowedRoles);

  return (req, res, next) => {
    if (!req.auth || !allowed.has(req.auth.role)) {
      return res.status(403).json({
        success: false,
        message: "شما مجوز انجام این عملیات را ندارید.",
      });
    }

    return next();
  };
}

module.exports = { authenticate, authorizeRoles };
