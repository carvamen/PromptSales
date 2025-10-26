const IdentityContract = require('../contracts/IdentityContract');

class UserProfileController {
  constructor() {
    this.identityContract = new IdentityContract();
  }

  async getUserInfo(userId) {
    return await this.identityContract.getUserInfo(userId);
  }
}

module.exports = UserProfileController;