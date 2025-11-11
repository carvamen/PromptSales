// src/domains/subscriptions/contracts/versions/v2/SubscriptionContractV2.js
const BaseVersionedContract = require('../../../../../shared/contracts/BaseVersionedContract');

class SubscriptionContractV2 extends BaseVersionedContract {
  constructor(deps) {
    super(deps, 'v2');
  }

  async getUserSubscription(userId) {
    return this.safeRequest('GetUserSubscription', async () => {
      const response = await this.http.get(`/v2/subscriptions/${userId}`, {
        headers: this.getHeaders()
      });
      
      return {
        plan: response.plan,
        status: response.status,
        expiresAt: response.expiresAt
      };
    });
  }

  async getRemovedData(userId) {
    return this.safeRequest('GetRemovedData', async () => {
      const response = await this.http.get(`/v2/subscriptions/${userId}/removed`, {
        headers: this.getHeaders()
      });
      return { removedData: response.items };
    });
  }
}