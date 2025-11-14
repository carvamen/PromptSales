const express = require("express");
const { requireAuth } = require("../../shared/auth/middleware");
const { rlPublic, rlInternal, rlAdmin } = require("../../shared/security/rate-limit");
const { requireScope, requireInternal } = require("../../shared/security/requireScope");
const { validate, zCampaignCreate } = require("../../shared/security/validators");
const { ipAllowlist } = require("../../shared/security/allowlist");

const router = express.Router();

// PUBLIC (catalog)
router.get("/public/templates", rlPublic, async (_req, res) => {
  res.json({ items: ["short-form","long-form"] });
});

// INTERNAL (m2m)
router.post("/internal/ads/sync",
  requireAuth, requireInternal(), ipAllowlist(), rlInternal, validate(zCampaignCreate),
  async (_req, res) => res.status(202).json({ accepted: true })
);

// ADMIN
router.post("/admin/users/ban",
  requireAuth, requireScope(["admin","role:admin"]), rlAdmin,
  validate(zCampaignCreate.pick({ name:true })), // ejemplo de zod
  async (_req, res) => res.json({ ok: true })
);

module.exports = router;