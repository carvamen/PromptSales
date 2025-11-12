class BaseVersionedContract {
  constructor(deps, version) {
    this.deps = deps;
    this.version = version;
    this.logger = deps.logger || console;
  }

  async safeRequest(operation, requestFn) {
    const startTime = Date.now();
    try {
      this.logger.info(`[${this.version}] ${operation} started`);
      const result = await requestFn();
      const duration = Date.now() - startTime;
      this.logger.info(`[${this.version}] ${operation} completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`[${this.version}] ${operation} failed after ${duration}ms`, error);
      throw error;
    }
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'User-Agent': `AIAsyncContract/${this.version}`
    };
  }
}

module.exports = BaseVersionedContract;