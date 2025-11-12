// src/gateways/rest/AdsChannelClient.js (ejemplo Circuit Breaker)
const { createBreaker } = require('../../shared/http/circuitBreakerClient');
const adsBreaker = createBreaker('https://mcp-promptads.svc.cluster.local');

async function getCampaign(campaignId) {
  try {
    const data = await adsBreaker.fire(`/campaigns/${campaignId}`);
    return data;
  } catch (err) {
    // fallback: retornar valor por defecto o cached response
    return { id: campaignId, status: 'unavailable', campaigns: [] };
  }
}

module.exports = { getCampaign };
