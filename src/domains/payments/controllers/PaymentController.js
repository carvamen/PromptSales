const PaymentContract = require('../contracts/PaymentContract');

class PaymentController {
  constructor() {
    this.paymentContract = new PaymentContract();
  }

  async processPayment(paymentData) {
    return await this.paymentContract.makePayment(paymentData);
  }
}

module.exports = PaymentController;