const BaseVersionedContract = require('../../../../../../shared/contracts/BaseVersionedContract');

class AIAsyncContractV2 extends BaseVersionedContract {
  constructor(deps) {
    super(deps, 'v2');
  }

  async processAIRequest(requestData) {
    return this.safeRequest('ProcessAIRequest', async () => {
      const response = await this.deps.http.post('/v2/ai/process', requestData, {
        headers: this.getHeaders(),
        timeout: 30000
      });
      
      // V2 includes additional metadata
      return {
        requestId: response.requestId,
        status: response.status,
        statusUrl: response.statusUrl,
        estimatedWaitTime: response.estimatedWaitTime,
        queuePosition: response.queuePosition,
        webhookUrl: response.webhookUrl
      };
    });
  }

  async getAIRequestStatus(requestId) {
    return this.safeRequest('GetAIRequestStatus', async () => {
      const response = await this.deps.http.get(`/v2/ai/requests/${requestId}`, {
        headers: this.getHeaders()
      });
      
      // V2 includes progress information
      return {
        requestId: response.requestId,
        status: response.status,
        result: response.result,
        error: response.error,
        progress: response.progress,
        estimatedCompletionTime: response.estimatedCompletionTime
      };
    });
  }

  // NEW in V2: Batch operations
  async getBatchStatus(requestIds) {
    return this.safeRequest('GetBatchStatus', async () => {
      const response = await this.deps.http.post('/v2/ai/requests/batch-status', {
        requestIds
      }, {
        headers: this.getHeaders()
      });
      
      return response;
    });
  }
}

module.exports = AIAsyncContractV2;