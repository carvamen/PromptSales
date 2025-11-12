class PromptWorker {
  constructor(deps) {
    this.jobStore = deps.jobStore;
    this.aiContract = deps.aiContract; // contract específico inyectado (v1)
    this.storage = deps.storage; // s3 client wrapper
    this.messageBus = deps.messageBus;
    this.logger = deps.logger;
    this.callbackSigner = deps.callbackSigner; // helper para firmar payloads
    this.http = deps.http;
  }

  async handle(jobId) {
    const job = await this.jobStore.getJob(jobId);
    if (!job || job.status !== 'queued') return;

    await this.jobStore.markProcessing(jobId);
    try {
      const payload = job.payload;
      // Llamada al modelo con timeout configurado (ejemplo: 30s)
      const options = { timeout: (payload.timeoutSeconds || 30) * 1000 };
      const modelResponse = await this.aiContract.callModel(payload.input, options);

      // Persistir resultado (ejemplo: JSON a S3)
      const key = `ai-results/${jobId}.json`;
      const url = await this.storage.putJson(key, { jobId, result: modelResponse, createdAt: new Date() });

      await this.jobStore.markReady(jobId, url);

      // Si existe callback, notificar (push)
      if (job.callback_url) {
        const body = { jobId, status: 'ready', resource: { url } };
        const signature = this.callbackSigner.sign(body);
        await this.http.post(job.callback_url, body, { headers: { 'X-Signature': signature }, timeout: 5000 });
        await this.db.query(`UPDATE ai_jobs SET callback_signed = true WHERE id=$1`, [jobId]).catch(()=>{});
      }
    } catch (err) {
      this.logger.error('PromptWorker failed', err);
      await this.jobStore.markFailed(jobId, err.message);
      // opcional: requeue/backoff policy
    }
  }
}

module.exports = PromptWorker;
