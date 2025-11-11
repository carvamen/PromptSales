// src/domains/subscriptions/contracts/versions/v1/SubscriptionContractV1.js
const BaseVersionedContract = require('../../../../../shared/contracts/BaseVersionedContract');

class SubscriptionContractV1 extends BaseVersionedContract {
  constructor(deps) {
    super(deps, 'v1');
  }

  async getUserSubscription(userId) {
    return this.safeRequest('GetUserSubscription', async () => {
      const response = await this.http.get(`/v1/subscriptions/${userId}`, {
        headers: this.getHeaders()
      });
      
      // V1 response format
      return {
        plan: response.planType, // Different field name in V1
        status: response.subscriptionStatus,
        validUntil: response.validUntil, // Different field name
        // No removed data in V1
      };
    });
  }

  // V1 doesn't have getRemovedData method
}