// src/shared/acl/ACLRegistry.js
const IdentityACL = require('../../domains/identity/acl/IdentityACL');
const SubscriptionACL = require('../../domains/subscriptions/acl/SubscriptionACL');

class ACLRegistry {
  static init(deps) {
    // ✅ Crear IdentityACL primero
    const identityACL = new IdentityACL(deps.identityContract);
    
    return {
      identityACL,
      
      // ✅ Diferentes ACLs de subscription para cada dominio
      subscriptionACLForPayments: new SubscriptionACL(identityACL, deps, 'v2'),
      subscriptionACLForCRM: new SubscriptionACL(identityACL, deps, 'v3'),
      subscriptionACLForAnalytics: new SubscriptionACL(identityACL, deps, 'v2')
    };
  }
}