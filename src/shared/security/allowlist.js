const ALLOW = (process.env.INTERNAL_ALLOWLIST || "").split(",").filter(Boolean);

function ipAllowlist() {
  return (req, res, next) => {
    if (!ALLOW.length) return next();
    const ip = (req.ip || "").replace("::ffff:","");
    if (!ALLOW.includes(ip)) return res.status(403).json({ code: "IP_NOT_ALLOWED" });
    next();
  };
}

module.exports = { ipAllowlist };