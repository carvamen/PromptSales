// src/domains/ia/contracts/IAContract.js
const BaseVersionedContract = require('../../../../shared/contracts/BaseVersionedContract');

class IAContractV1 extends BaseVersionedContract {
  constructor(deps) {
    super(deps, 'v1');
    this.taskManager = deps.taskManager;
    this.asyncService = deps.asyncService;
  }

  async submitAsyncTask(operation, input, userId) {
    return this.safeRequest('SubmitAsyncTask', async () => {
      const task = await this.asyncService.submitTask(operation, input, userId);
      
      return {
        taskId: task.id,
        status: task.status,
        statusUrl: `/api/v1/ia/tasks/${task.id}/status`,
        estimatedCompletionTime: task.estimatedCompletionTime,
        progress: task.progress
      };
    });
  }

  async getTaskStatus(taskId, userId) {
    return this.safeRequest('GetTaskStatus', async () => {
      const task = await this.taskManager.getTask(taskId, userId);
      
      return {
        taskId: task.id,
        status: task.status,
        progress: task.progress,
        estimatedCompletionTime: task.estimatedCompletionTime,
        resultUrl: task.status === 'completed' ? 
          `/api/v1/ia/tasks/${task.id}/result` : null,
        error: task.error
      };
    });
  }

  async getTaskResult(taskId, userId) {
    return this.safeRequest('GetTaskResult', async () => {
      const task = await this.taskManager.getCompletedTask(taskId, userId);
      
      return {
        taskId: task.id,
        result: task.result,
        completedAt: task.completedAt,
        processingTime: task.completedAt - task.createdAt
      };
    });
  }

  async cancelTask(taskId, userId) {
    return this.safeRequest('CancelTask', async () => {
      await this.asyncService.cancelTask(taskId, userId);
      return { cancelled: true };
    });
  }
}

module.exports = IAContractV1;