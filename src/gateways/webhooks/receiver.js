// src/gateways/webhooks/receiver.js (Actualizado)
class WebhookReceiver {
  constructor(verificationService, taskManager) {
    this.verificationService = verificationService;
    this.taskManager = taskManager;
  }

  async handleIATaskNotification(req, res) {
    try {
      // Verificar firma del webhook de SNS
      const isValid = await this.verificationService.verifySNSMessage(req);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const message = JSON.parse(req.body.Message);
      
      if (message.eventType === 'ia.task.completed') {
        // Actualizar estado local si es necesario
        await this.taskManager.updateTaskStatus(
          message.taskId, 
          'completed', 
          message.result
        );
        
        // Notificar a clientes suscritos via WebSocket o push notifications
        await this.notifyClient(message.userId, {
          type: 'TASK_COMPLETED',
          taskId: message.taskId,
          resultUrl: message.resultUrl
        });
      }

      res.json({ received: true });

    } catch (error) {
      console.error('Error handling IA task notification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}