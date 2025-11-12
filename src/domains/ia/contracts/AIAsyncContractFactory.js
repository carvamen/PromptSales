const AIAsyncContractV1 = require('./versions/v1/AIAsyncContractV1');
const AIAsyncContractV2 = require('./versions/v2/AIAsyncContractV2');

class AIAsyncContractFactory {
  static create(version, deps) {
    const versionMap = {
      'v1': AIAsyncContractV1,
      'v2': AIAsyncContractV2
    };

    const ContractClass = versionMap[version];
    if (!ContractClass) {
      throw new Error(`Unsupported contract version: ${version}`);
    }

    return new ContractClass(deps);
  }

  static getSupportedVersions() {
    return ['v1', 'v2'];
  }

  static getDefaultVersion() {
    return 'v2';
  }
}

module.exports = AIAsyncContractFactory;