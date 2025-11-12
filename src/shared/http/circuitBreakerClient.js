// src/shared/http/circuitBreakerClient.js
const CircuitBreaker = require('opossum');
const fetch = require('node-fetch');

function createBreaker(targetUrl, options = {}) {
  const defaultOpts = {
    timeout: 3000, // ms
    errorThresholdPercentage: 50,
    resetTimeout: 10000 // ms
  };
  const opts = { ...defaultOpts, ...options };

  const action = (path, optsFetch = {}) => fetch(`${targetUrl}${path}`, optsFetch)
    .then(res => {
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return res.json();
    });

  const breaker = new CircuitBreaker(action, opts);

  breaker.on('open', () => console.warn(`Breaker OPEN for ${targetUrl}`));
  breaker.on('halfOpen', () => console.info(`Breaker HALF-OPEN for ${targetUrl}`));
  breaker.on('close', () => console.info(`Breaker CLOSED for ${targetUrl}`));

  return breaker;
}

module.exports = { createBreaker };
