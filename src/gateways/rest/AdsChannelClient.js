// src/gateways/rest/AdsChannelClient.js
const axios = require('axios');
const CircuitBreaker = require('../../shared/http/circuitBreakerClient');

const adsCircuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  recoveryTime: 10000,
});

async function getAdsCampaigns() {
  return adsCircuitBreaker.call(
    async () => {
      const response = await axios.get('https://ads-service/api/v1/campaigns');
      return response.data;
    },
    (errorMessage) => {
      console.log('Returning fallback due to circuit breaker:', errorMessage);
      return { campaigns: [], message: 'Fallback: ads service unavailable' };
    }
  );
}

module.exports = { getAdsCampaigns };
