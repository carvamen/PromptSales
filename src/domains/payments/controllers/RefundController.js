class RefundController {
  async processRefund(transactionId) {
    // Refund processing logic
    return { refundId: 'ref_123', status: 'processed' };
  }
}

module.exports = RefundController;