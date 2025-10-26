// Main integration file connecting all layers
const IdentityContract = require('../domains/identity/contracts/IdentityContract');
const SubscriptionContract = require('../domains/subscriptions/contracts/SubscriptionContract');
const SubscriptionACL = require('../domains/subscriptions/acl/SubscriptionACL');
const PaymentContract = require('../domains/payments/contracts/PaymentContract');

class SystemIntegration {
  constructor() {
    this.setupDomains();
  }

  setupDomains() {
    // Initialize contracts
    this.identityContract = new IdentityContract();
    this.subscriptionContract = new SubscriptionContract();
    this.paymentContract = new PaymentContract();
    
    // Setup Anti-Corruption Layer
    this.subscriptionACL = new SubscriptionACL(
      this.identityContract,
      this.subscriptionContract
    );
    
    // Initialize controllers with dependencies
    this.setupControllers();
  }

  setupControllers() {
    // Subscription domain controllers
    this.subscriptionRenewalController = new SubscriptionsRenewalController(this.subscriptionACL);
    this.subscriptionAcquisitionController = new SubscriptionsAcquisitionController();
    this.subscriptionCancellationController = new SubscriptionsCancellationController();
    
    // Payment domain controllers
    this.paymentController = new PaymentController();
    this.invoiceController = new InvoiceController();
    this.refundController = new RefundController();
  }
}

module.exports = SystemIntegration;