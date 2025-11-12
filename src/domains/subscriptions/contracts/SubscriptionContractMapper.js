// src/domains/subscriptions/contracts/SubscriptionContractMapper.js
class SubscriptionContractMapper {
  static toDomainResponse(contractResponse, targetVersion) {
    switch (targetVersion) {
      case 'v1':
        return this.mapToV1Format(contractResponse);
      case 'v2':
        return this.mapToV2Format(contractResponse);
      case 'v3':
        return this.mapToV3Format(contractResponse);
      default:
        return this.mapToV2Format(contractResponse);
    }
  }

  static mapToV1Format(response) {
    // Transform any version to V1 format
    return {
      planType: response.plan,
      subscriptionStatus: response.status,
      validUntil: response.expiresAt
    };
  }

  static mapToV2Format(response) {
    // Transform any version to V2 format
    return {
      plan: response.plan,
      status: response.status,
      expiresAt: response.expiresAt || response.validUntil
    };
  }

  static mapToV3Format(response) {
    // Transform any version to V3 format
    return {
      plan: response.plan,
      tier: response.tier || 'standard', // Default value
      status: response.status,
      expiresAt: response.expiresAt,
      autoRenew: response.autoRenew !== undefined ? response.autoRenew : true,
      billingPeriod: response.billingPeriod || 'monthly'
    };
  }
}

module.exports = SubscriptionContractMapper;