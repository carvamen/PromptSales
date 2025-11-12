const crypto = require('crypto');

class CallbackSigner {
  constructor(secret) { this.secret = secret; }
  sign(payload) {
    const h = crypto.createHmac('sha256', this.secret);
    h.update(JSON.stringify(payload));
    return h.digest('hex');
  }
  verify(payload, signature) {
    return this.sign(payload) === signature;
  }
}

module.exports = CallbackSigner;
