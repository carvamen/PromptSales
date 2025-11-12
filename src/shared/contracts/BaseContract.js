class BaseContract {
  constructor({ version = 'v1', httpClient, logger }) {
    this.version = version;
    this.http = httpClient;
    this.logger = logger || console;
  }

  getHeaders() {
    return {
      'x-contract-version': this.version,
      'content-type': 'application/json'
    };
  }

  async safeRequest(label, fn) {
    try {
      const res = await fn();
      this.logger.info(`[Contract] ${label} [${this.version}] OK`);
      return res;
    } catch (err) {
      this.logger.error(`[Contract] ${label} [${this.version}] FAILED: ${err.message}`);
      throw new Error(`${label}_FAILED_${this.version}`);
    }
  }
}

module.exports = BaseContract;
