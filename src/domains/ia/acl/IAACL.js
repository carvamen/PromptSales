// src/domains/ia/acl/IAACL.js
const IAContractFactory = require('../contracts/IAContractFactory');

class IAACL {
  constructor(identityACL, subscriptionACL, deps, version = 'v1') {
    this.identityACL = identityACL;
    this.subscriptionACL = subscriptionACL;
    this.deps = deps;
    this.version = version;
    this.iaContract = IAContractFactory.create(version, deps);
  }

  async submitAsyncTask(operation, input, userId) {
    // ✅ Validar permisos usando IdentityACL
    const canPerformIA = await this.identityACL.validateUserAccess(userId, 'ia_operations');
    if (!canPerformIA) {
      throw new Error('User does not have permission for IA operations');
    }

    // ✅ Validar suscripción usando SubscriptionACL
    const hasActiveSubscription = await this.subscriptionACL.canUserPerformAction(userId, 'use_ia');
    if (!hasActiveSubscription) {
      throw new Error('Active subscription required for IA operations');
    }

    return await this.iaContract.submitAsyncTask(operation, input, userId);
  }

  async getTaskStatus(taskId, userId) {
    // ✅ Validar propiedad de la tarea
    await this.validateTaskOwnership(taskId, userId);
    return await this.iaContract.getTaskStatus(taskId, userId);
  }

  async getTaskResult(taskId, userId) {
    // ✅ Validar propiedad de la tarea
    await this.validateTaskOwnership(taskId, userId);
    return await this.iaContract.getTaskResult(taskId, userId);
  }

  async cancelTask(taskId, userId) {
    // ✅ Validar propiedad de la tarea
    await this.validateTaskOwnership(taskId, userId);
    return await this.iaContract.cancelTask(taskId, userId);
  }

  async validateTaskOwnership(taskId, userId) {
    // Implementar validación de propiedad
    const task = await this.deps.taskManager.getTask(taskId, userId);
    if (!task || task.userId !== userId) {
      throw new Error('Task not found or access denied');
    }
    return true;
  }

  async getUserIATasks(userId, status = null) {
    const userInfo = await this.identityACL.getUserInfo(userId);
    const tasks = await this.deps.taskManager.getUserTasks(userId, status);

    return {
      user: userInfo,
      tasks: tasks.map(task => ({
        id: task.id,
        operation: task.operation,
        status: task.status,
        progress: task.progress,
        createdAt: task.createdAt
      }))
    };
  }
}

module.exports = IAACL;