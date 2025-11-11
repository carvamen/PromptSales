// src/domains/subscriptions/contracts/SubscriptionContractFactory.js
const SubscriptionContractV1 = require('./versions/v1/SubscriptionContractV1');
const SubscriptionContractV2 = require('./versions/v2/SubscriptionContractV2');
const SubscriptionContractV3 = require('./versions/v3/SubscriptionContractV3');

class SubscriptionContractFactory {
  static create(version, deps) {
    const versionMap = {
      'v1': SubscriptionContractV1,
      'v2': SubscriptionContractV2,
      'v3': SubscriptionContractV3
    };

    const ContractClass = versionMap[version];
    if (!ContractClass) {
      throw new Error(`Unsupported contract version: ${version}`);
    }

    return new ContractClass(deps);
  }

  static getSupportedVersions() {
    return ['v1', 'v2', 'v3'];
  }

  static getDefaultVersion() {
    return 'v2';
  }

  static isVersionSupported(version) {
    return this.getSupportedVersions().includes(version);
  }
}

module.exports = SubscriptionContractFactory;