const BaseVersionedContract = require('../../../../../../shared/contracts/BaseVersionedContract');

class AIAsyncContractV1 extends BaseVersionedContract {
  constructor(deps) {
    super(deps, 'v1');
  }

  async processAIRequest(requestData) {
    return this.safeRequest('ProcessAIRequest', async () => {
      const response = await this.deps.http.post('/v1/ai/process', requestData, {
        headers: this.getHeaders(),
        timeout: 30000
      });
      
      return {
        requestId: response.requestId,
        status: response.status,
        statusUrl: response.statusUrl
      };
    });
  }

  async getAIRequestStatus(requestId) {
    return this.safeRequest('GetAIRequestStatus', async () => {
      const response = await this.deps.http.get(`/v1/ai/requests/${requestId}`, {
        headers: this.getHeaders()
      });
      
      return {
        requestId: response.requestId,
        status: response.status,
        result: response.result,
        error: response.error
      };
    });
  }

  async cancelAIRequest(requestId) {
    return this.safeRequest('CancelAIRequest', async () => {
      const response = await this.deps.http.delete(`/v1/ai/requests/${requestId}`, {
        headers: this.getHeaders()
      });
      
      return {
        requestId: response.requestId,
        status: response.status
      };
    });
  }
}

module.exports = AIAsyncContractV1;