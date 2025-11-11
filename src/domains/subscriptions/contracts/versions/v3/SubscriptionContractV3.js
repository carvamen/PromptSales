// src/domains/subscriptions/contracts/versions/v3/SubscriptionContractV3.js
const BaseVersionedContract = require('../../../../../shared/contracts/BaseVersionedContract');

class SubscriptionContractV3 extends BaseVersionedContract {
  constructor(deps) {
    super(deps, 'v3');
  }

  async getUserSubscription(userId) {
    return this.safeRequest('GetUserSubscription', async () => {
      const response = await this.http.get(`/v3/subscriptions/${userId}`, {
        headers: this.getHeaders()
      });
      
      // Enhanced V3 response
      return {
        plan: response.plan,
        tier: response.tier, // New field
        status: response.status,
        expiresAt: response.expiresAt,
        autoRenew: response.autoRenew, // New field
        billingPeriod: response.billingPeriod // New field
      };
    });
  }

  async getRemovedData(userId) {
    return this.safeRequest('GetRemovedData', async () => {
      const response = await this.http.get(`/v3/subscriptions/${userId}/removed`, {
        headers: this.getHeaders()
      });
      return { 
        removedData: response.items,
        removalReason: response.reason, // Enhanced in V3
        removedAt: response.timestamp
      };
    });
  }

  // New method in V3
  async getSubscriptionAnalytics(userId) {
    return this.safeRequest('GetSubscriptionAnalytics', async () => {
      const response = await this.http.get(`/v3/subscriptions/${userId}/analytics`, {
        headers: this.getHeaders()
      });
      return response;
    });
  }
}