// src/apps/prompt-content/workers/ia-worker.js
const { Worker } = require('bullmq');
const { callExternalAI } = require('../../../gateways/mcp/AdsOrchestratorClient'); // ejemplo
const worker = new Worker('ia-jobs', async job => {
  // Llamada que puede tardar pero está en background
  const output = await callExternalAI(job.data.prompt);
  return { output };
}, { connection: { host: process.env.REDIS_HOST || '127.0.0.1' }});
