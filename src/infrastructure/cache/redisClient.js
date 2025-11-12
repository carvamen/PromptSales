const Redis = require("ioredis");
const redis = new Redis({ host: process.env.REDIS_HOST, port: 6379, tls: {} });

function cacheSet(k, v, ttl=300){ return redis.set(k, JSON.stringify(v), "EX", ttl); }
async function cacheGet(k){ const v = await redis.get(k); return v ? JSON.parse(v) : null; }

module.exports = { redis, cacheSet, cacheGet };