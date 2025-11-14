function requireScope(scopes) {
  const needed = Array.isArray(scopes) ? scopes : [scopes];
  return (req, res, next) => {
    const claims = req.user || {};
    const tokenScopes = new Set((claims.scope || "").split(" "));
    const roles = new Set(claims.roles || claims["https://promptsales.com/roles"] || []);
    const ok = needed.every(s => tokenScopes.has(s) || roles.has(s));
    if (!ok) return res.status(403).json({ code: "INSUFFICIENT_SCOPE" });
    next();
  };
}

function requireInternal() {
  return (req, res, next) => {
    const claims = req.user || {};
    if (!(claims.azp || claims.gty === "client-credentials")) {
      return res.status(403).json({ code: "FORBIDDEN_INTERNAL" });
    }
    next();
  };
}

module.exports = { requireScope, requireInternal };