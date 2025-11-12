// src/domains/ia/workers/IAWorker.js
class IAWorker {
  constructor(asyncIAService, logger) {
    this.asyncIAService = asyncIAService;
    this.logger = logger;
  }

  async processTask(job) {
    const { taskId, operation, input, userId } = job.data;
    
    try {
      await this.asyncIAService.processTask(taskId, operation, input, userId);
      this.logger.info(`Task ${taskId} completed successfully`);
    } catch (error) {
      this.logger.error(`Task ${taskId} failed: ${error.message}`);
      throw error;
    }
  }
}

module.exports = IAWorker;