// src/domains/ia/controllers/IACallbackController.js
class IACallbackController {
  constructor(taskManager, snsService) {
    this.taskManager = taskManager;
    this.snsService = snsService;
  }

  async handleTaskCallback(req, res) {
    const { taskId } = req.params;
    const { status, result, error, progress } = req.body;

    try {
      const task = await this.taskManager.getTaskById(taskId);
      
      if (status === 'completed') {
        task.markAsCompleted(result);
      } else if (status === 'failed') {
        task.markAsFailed(error);
      } else if (status === 'processing' && progress) {
        task.updateProgress(progress);
      }

      await this.taskManager.updateTask(task);

      // Notificar a suscriptores via SNS
      await this.snsService.publish({
        TopicArn: process.env.IA_TASKS_TOPIC_ARN,
        Message: JSON.stringify({
          eventType: `ia.task.${status}`,
          taskId: task.id,
          userId: task.userId,
          status: task.status,
          progress: task.progress
        })
      });

      res.json({ success: true });

    } catch (error) {
      console.error('Error handling task callback:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = IACallbackController;