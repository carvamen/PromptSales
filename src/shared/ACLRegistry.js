const IdentityACL = require('../../domains/identity/acl/IdentityACL');
const SubscriptionACL = require('../../domains/subscriptions/acl/SubscriptionACL');
const IAACL = require('../../domains/ia/acl/IAACL');

class ACLRegistry {
  static init(deps) {
    // ✅ Crear IdentityACL primero (dependencia base)
    const identityACL = new IdentityACL(deps.identityContract);
    
    return {
      identityACL,
      
      // ✅ Diferentes ACLs de subscription para cada dominio
      subscriptionACLForPayments: new SubscriptionACL(identityACL, deps, 'v2'),
      subscriptionACLForCRM: new SubscriptionACL(identityACL, deps, 'v3'),
      subscriptionACLForAnalytics: new SubscriptionACL(identityACL, deps, 'v2'),
      
      iaACL: new IAACL(identityACL, deps.subscriptionACLForAnalytics, deps, 'v1')
    };
  }
}

module.exports = ACLRegistry;