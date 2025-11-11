// src/shared/contracts/BaseVersionedContract.js
const BaseContract = require('./BaseContract');

class BaseVersionedContract extends BaseContract {
  constructor(deps, version) {
    super({ ...deps, version });
    this.version = version;
  }

  // Common validation across versions
  validateUserId(userId) {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID');
    }
    return userId;
  }
}

module.exports = BaseVersionedContract;