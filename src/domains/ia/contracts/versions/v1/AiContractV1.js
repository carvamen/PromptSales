const BaseVersionedContract = require('../../../shared/contracts/BaseVersionedContract');

class AiContractV1 extends BaseVersionedContract {
  constructor(deps) {
    super(deps, 'v1');
  }

  // Simple wrapper to the external AI provider (sync call)
  async callModel(input, options = {}) {
    return this.safeRequest('callModel', async () => {
      const res = await this.http.post('/v1/external/ai/complete', { input, options }, {
        headers: this.getHeaders(),
        timeout: options.timeout || 60_000 // ms
      });
      return res.data;
    });
  }
}

module.exports = AiContractV1;
