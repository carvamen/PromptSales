// server.js (ejemplo)
import express from "express";
import { requireAuth } from "../../shared/auth/middleware.js";
import { SubscriptionRenewalController } from "../../domains/subscriptions/controllers/SubscriptionRenewalController.js";
import { buildSubscriptionACL } from "./wiring/subscriptions.js"; // cableado de clients/mapper

const app = express();
app.use(express.json());

const renewal = SubscriptionRenewalController({ acl: buildSubscriptionACL() });
app.post("/subscriptions/renew", requireAuth, renewal.renew);

export default app;