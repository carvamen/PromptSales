class SubscriptionACL {
  constructor(identityContract, subscriptionContract) {
    this.identityContract = identityContract;
    this.subscriptionContract = subscriptionContract;
  }

  async getUserSubscriptionWithProfile(userId) {
    // Anti-corruption layer logic
    const userInfo = await this.identityContract.getUserInfo(userId);
    const subscription = await this.subscriptionContract.getUserSubscription(userId);
    
    return {
      user: userInfo,
      subscription: subscription
    };
  }
}

module.exports = SubscriptionACL;