const axios = require("axios");
const CircuitBreaker = require("../../shared/http/circuitBreakerClient"); // ya existe en tu repo

const breaker = new CircuitBreaker({ failureThreshold: 3, recoveryTime: 10_000 });

async function metaGetCampaign(id) {
  return breaker.call(
    async () => {
      const res = await axios.get(`${process.env.META_ADS_BASE}/campaigns/${id}`, {
        timeout: 3000,
        headers: { Authorization: `Bearer ${process.env.META_TOKEN}` }
      });
      return res.data;
    },
    () => ({ id, status: "unknown", message: "fallback-meta" })
  );
}

module.exports = { metaGetCampaign };