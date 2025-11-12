// src/domains/payments/controllers/PaymentController.js
class PaymentController {
  constructor(deps) {
    // ✅ Solo recibe ACLs, ningún contract directo
    this.subscriptionACL = deps.subscriptionACL;
  }

  async processPayment(userId, amount) {
    // ✅ Usa métodos de alto nivel del ACL
    const billingInfo = await this.subscriptionACL.getSubscriptionForBilling(userId);
    const canPay = await this.subscriptionACL.canUserPerformAction(userId, 'make_payment');

    if (!canPay) {
      throw new Error('Usuario no puede realizar pagos');
    }

    return await this.chargeUser(
      billingInfo.billingContact.email,
      billingInfo.subscription.amount
    );
  }
}