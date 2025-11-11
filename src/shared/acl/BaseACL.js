// src/shared/acl/BaseACL.js
class BaseACL {
  constructor({ logger }) {
    this.logger = logger;
  }

  async safeCall(label, fn) {
    try {
      return await fn();
    } catch (err) {
      this.logger.error(`[ACL] ${label} failed`, { error: err.message });
      throw new Error(`ACL_${label}_ERROR`);
    }
  }
}

module.exports = BaseACL;
