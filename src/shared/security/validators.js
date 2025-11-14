const { z } = require("zod");

const zCampaignCreate = z.object({
  name: z.string().min(3),
  channel: z.enum(["google","meta","tiktok","mailchimp","linkedin"]),
  budget: z.number().positive().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

function validate(schema) {
  return (req, res, next) => {
    const src = ["POST","PUT","PATCH"].includes(req.method) ? req.body : req.query;
    const parsed = schema.safeParse(src);
    if (!parsed.success) {
      return res.status(400).json({ code: "INVALID_INPUT", errors: parsed.error.issues });
    }
    return next();
  };
}

module.exports = { zCampaignCreate, validate };