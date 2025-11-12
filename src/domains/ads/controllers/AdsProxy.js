// src/domains/ads/controllers/AdsProxy.js
const { getAdsCampaigns } = require('../../../gateways/rest/AdsChannelClient');

async function fetchCampaigns(req, res) {
  const data = await getAdsCampaigns();
  res.json(data);
}

module.exports = { fetchCampaigns };
