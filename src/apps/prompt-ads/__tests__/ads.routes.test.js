const request = require("supertest");
const app = require("../server");

describe("Ads routes security", () => {
  it("public ok", async () => {
    const res = await request(app).get("/api/v1/public/templates");
    expect([200,404]).toContain(res.status); // según wiring real
  });

  it("internal requiere JWT m2m", async () => {
    const res = await request(app)
      .post("/api/v1/internal/ads/sync")
      .send({ name:"X", channel:"google", start_date:"2025-07-20" });
    expect([401,403]).toContain(res.status);
  });
});