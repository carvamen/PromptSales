// src/domains/ia/controllers/AsyncIAController.js
class AsyncIAController {
  constructor(iaACL, deps) {
    this.iaACL = iaACL;
    this.deps = deps;
  }

  async submitTask(req, res) {
    try {
      const { operation, input } = req.body;
      const userId = req.user.id; // Asumiendo autenticación

      const response = await this.iaACL.submitAsyncTask(operation, input, userId);

      res.status(202).json({
        success: true,
        data: response,
        message: 'Task submitted for processing'
      });

    } catch (error) {
      this.deps.logger.error('Error submitting async task', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getTaskStatus(req, res) {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      const status = await this.iaACL.getTaskStatus(taskId, userId);

      res.json({
        success: true,
        data: status
      });

    } catch (error) {
      this.deps.logger.error('Error getting task status', error);
      res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
  }

  async getTaskResult(req, res) {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      const result = await this.iaACL.getTaskResult(taskId, userId);

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      this.deps.logger.error('Error getting task result', error);
      res.status(404).json({
        success: false,
        error: 'Result not available'
      });
    }
  }

  async cancelTask(req, res) {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      await this.iaACL.cancelTask(taskId, userId);

      res.json({
        success: true,
        message: 'Task cancelled successfully'
      });

    } catch (error) {
      this.deps.logger.error('Error cancelling task', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = AsyncIAController;