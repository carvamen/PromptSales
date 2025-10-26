const SubscriptionActualizationService = require('../services/SubscriptionActualizationService');

class SubscriptionsRenewalController {
  constructor(subscriptionACL) {
    this.actualizationService = new SubscriptionActualizationService(subscriptionACL);
  }

  async renewSubscription(userId) {
    return await this.actualizationService.actualizeSubscription(userId);
  }
}

module.exports = SubscriptionsRenewalController;