// src/domains/ia/controllers/IAController.js
const { Queue } = require('bullmq');
const connection = { host: process.env.REDIS_HOST || '127.0.0.1' };
const iaQueue = new Queue('ia-jobs', { connection });

async function enqueuePrompt(req, res) {
  const { prompt } = req.body;
  const job = await iaQueue.add('generate', { prompt }, { removeOnComplete: true, removeOnFail: true });
  res.status(202).json({ jobId: job.id, statusUrl: `/jobs/${job.id}` });
}

module.exports = { enqueuePrompt };
