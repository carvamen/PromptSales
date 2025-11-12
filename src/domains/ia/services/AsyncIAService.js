// src/domains/ia/services/AsyncIAService.js
const { v4: uuidv4 } = require('uuid');

class AsyncIAService {
  constructor(taskManager, sqsService, snsService, lambdaService) {
    this.taskManager = taskManager;
    this.sqsService = sqsService;
    this.snsService = snsService;
    this.lambdaService = lambdaService;
  }

  async submitTask(operation, input, userId) {
    const task = await this.taskManager.createTask({
      id: uuidv4(),
      userId,
      operation,
      input,
      estimatedCompletionTime: this.calculateEstimatedTime(operation, input)
    });

    // Encolar en SQS para procesamiento asíncrono
    await this.sqsService.enqueue(process.env.IA_TASKS_QUEUE_URL, {
      taskId: task.id,
      operation,
      input,
      userId
    });

    return task;
  }

  async processTask(taskId, operation, input, userId) {
    const task = await this.taskManager.getTask(taskId, userId);
    
    try {
      task.markAsProcessing();
      await this.taskManager.updateTask(task);

      // Opción 1: Invocar Lambda function para procesamiento pesado
      if (this.shouldUseLambda(operation)) {
        const result = await this.invokeIALambda(operation, input, taskId);
        task.markAsCompleted(result);
      
      // Opción 2: Procesamiento directo (solo para operaciones rápidas)
      } else {
        const result = await this.executeIAOperation(operation, input, (progress) => {
          task.updateProgress(progress);
          this.taskManager.updateTask(task);
        });
        task.markAsCompleted(result);
      }

      await this.taskManager.updateTask(task);

      // Publicar notificación en SNS para webhooks
      await this.publishTaskCompletionNotification(task);

    } catch (error) {
      task.markAsFailed(error.message);
      await this.taskManager.updateTask(task);
      throw error;
    }
  }

  async invokeIALambda(operation, input, taskId) {
    const lambdaFunctionName = this.getLambdaFunctionName(operation);
    
    const result = await this.lambdaService.invoke({
      FunctionName: lambdaFunctionName,
      InvocationType: 'RequestResponse', // O 'Event' para asíncrono
      Payload: JSON.stringify({
        taskId,
        operation,
        input,
        callbackUrl: `${process.env.API_BASE_URL}/api/v1/ia/tasks/${taskId}/callback`
      })
    });

    return JSON.parse(result.Payload);
  }

  async publishTaskCompletionNotification(task) {
    await this.snsService.publish({
      TopicArn: process.env.IA_TASKS_TOPIC_ARN,
      Message: JSON.stringify({
        eventType: 'ia.task.completed',
        taskId: task.id,
        userId: task.userId,
        operation: task.operation,
        completedAt: task.completedAt,
        resultUrl: `${process.env.API_BASE_URL}/api/v1/ia/tasks/${task.id}/result`
      }),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: 'ia.task.completed'
        },
        userId: {
          DataType: 'String',
          StringValue: task.userId
        }
      }
    });
  }

  calculateEstimatedTime(operation, input) {
    const estimates = {
      'content-generation': 30000, // 30 segundos
      'image-processing': 60000,   // 1 minuto
      'data-analysis': 120000      // 2 minutos
    };
    
    return new Date(Date.now() + (estimates[operation] || 30000));
  }

  shouldUseLambda(operation) {
    const lambdaOperations = ['content-generation', 'image-processing', 'data-analysis'];
    return lambdaOperations.includes(operation);
  }

  getLambdaFunctionName(operation) {
    const functionMap = {
      'content-generation': process.env.CONTENT_GENERATION_LAMBDA,
      'image-processing': process.env.IMAGE_PROCESSING_LAMBDA,
      'data-analysis': process.env.DATA_ANALYSIS_LAMBDA
    };
    
    return functionMap[operation];
  }

  async cancelTask(taskId, userId) {
    const task = await this.taskManager.getTask(taskId, userId);
    
    if (task.status === 'pending' || task.status === 'processing') {
      task.markAsFailed('Task cancelled by user');
      await this.taskManager.updateTask(task);
      
      // Publicar evento de cancelación
      await this.snsService.publish({
        TopicArn: process.env.IA_TASKS_TOPIC_ARN,
        Message: JSON.stringify({
          eventType: 'ia.task.cancelled',
          taskId: task.id,
          userId: task.userId
        })
      });
    }
  }
}

module.exports = AsyncIAService;