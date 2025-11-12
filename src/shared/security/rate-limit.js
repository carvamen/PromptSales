const rateLimit = require("express-rate-limit");
const rlPublic   = rateLimit({ windowMs: 60_000, max: 60  });
const rlInternal = rateLimit({ windowMs: 60_000, max: 600 });
const rlAdmin    = rateLimit({ windowMs: 60_000, max: 120 });
module.exports = { rlPublic, rlInternal, rlAdmin };