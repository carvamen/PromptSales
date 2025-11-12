// AiACL: expone métodos de alto nivel y oculta detalles del contrato
const AiContractFactory = require('../contracts/AiContractFactory'); // implementa factory similar al resto

class AiACL {
  constructor(identityACL, deps, version = 'v1') {
    this.identityACL = identityACL; // ejemplo: usar datos del usuario si hace falta
    this.deps = deps;
    this.contract = AiContractFactory.create(version, deps);
  }

  // Encolar prompt para procesamiento asíncrono
  async enqueuePrompt(userId, payload) {
    // opcional: validar user
    const userInfo = await this.identityACL.getUserInfo(userId);
    // usar JobStore para crear job
    const job = await this.deps.jobStore.createJob({
      domain: 'ia',
      type: 'prompt',
      payload: { userId, ...payload },
      callback_url: payload.callback_url
    });
    // publicar mensaje en bus para workers
    await this.deps.messageBus.publish('ai.jobs.new', { jobId: job.id });
    return job;
  }

  // LLAMADA SINCRONA (solo para fallback / testing)
  async callModelSync(input, options) {
    return this.contract.callModel(input, options);
  }
}

module.exports = AiACL;
