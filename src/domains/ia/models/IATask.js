// src/domains/ia/models/IATask.js
class IATask {
  constructor({
    id,
    userId,
    operation,
    input,
    status = 'pending',
    result = null,
    error = null,
    progress = 0,
    estimatedCompletionTime = null,
    createdAt = new Date(),
    updatedAt = new Date(),
    completedAt = null
  }) {
    this.id = id;
    this.userId = userId;
    this.operation = operation;
    this.input = input;
    this.status = status; // pending, processing, completed, failed
    this.result = result;
    this.error = error;
    this.progress = progress;
    this.estimatedCompletionTime = estimatedCompletionTime;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.completedAt = completedAt;
  }

  markAsProcessing() {
    this.status = 'processing';
    this.updatedAt = new Date();
  }

  markAsCompleted(result) {
    this.status = 'completed';
    this.result = result;
    this.progress = 100;
    this.completedAt = new Date();
    this.updatedAt = new Date();
  }

  markAsFailed(error) {
    this.status = 'failed';
    this.error = error;
    this.updatedAt = new Date();
  }

  updateProgress(progress, estimatedCompletionTime = null) {
    this.progress = progress;
    this.estimatedCompletionTime = estimatedCompletionTime;
    this.updatedAt = new Date();
  }
}

module.exports = IATask;