// src/domains/subscriptions/acl/SubscriptionACL.js
const SubscriptionContractFactory = require('../contracts/SubscriptionContractFactory');

class SubscriptionACL {
  constructor(identityACL, deps, version = 'v2') {
    this.identityACL = identityACL; // ✅ Recibe IdentityACL, no el contract
    this.deps = deps;
    this.version = version;
    this.subscriptionContract = SubscriptionContractFactory.create(version, deps);
  }

  async getUserSubscriptionWithProfile(userId) {
    // ✅ Usa IdentityACL en lugar del contract directo
    const userInfo = await this.identityACL.getUserInfo(userId);
    const subscription = await this.subscriptionContract.getUserSubscription(userId);

    return {
      user: userInfo,
      subscription,
      contractVersion: this.version
    };
  }

  async canUserPerformAction(userId, action) {
    // ✅ Combina validaciones de ambos ACLs
    const [hasAccess, subscription] = await Promise.all([
      this.identityACL.validateUserAccess(userId, 'subscription'),
      this.subscriptionContract.getUserSubscription(userId)
    ]);

    return hasAccess && subscription.status === 'active';
  }

  async getSubscriptionForBilling(userId) {
    const userProfile = await this.identityACL.getUserProfileForDisplay(userId);
    const subscription = await this.subscriptionContract.getUserSubscription(userId);

    return {
      billingContact: {
        name: userProfile.displayName,
        email: userProfile.email
      },
      subscription: {
        plan: subscription.plan,
        amount: this.calculateBillingAmount(subscription.plan),
        nextBillingDate: subscription.expiresAt
      }
    };
  }

  calculateBillingAmount(plan) {
    const prices = { basic: 10, premium: 25, enterprise: 100 };
    return prices[plan] || 0;
  }
}

module.exports = SubscriptionACL;