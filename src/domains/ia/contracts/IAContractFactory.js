// src/domains/ia/contracts/IAContractFactory.js
const IAContractV1 = require('./versions/v1/IAContractV1');

class IAContractFactory {
  static create(version, deps) {
    const versionMap = {
      'v1': IAContractV1
    };

    const ContractClass = versionMap[version];
    if (!ContractClass) {
      throw new Error(`Unsupported IA contract version: ${version}`);
    }

    return new ContractClass(deps);
  }

  static getSupportedVersions() {
    return ['v1'];
  }

  static getDefaultVersion() {
    return 'v1';
  }
}

module.exports = IAContractFactory;