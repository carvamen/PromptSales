// src/shared/aws/SQSService.js
const { SQSClient, SendMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');

class SQSService {
  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
  }

  async enqueue(queueUrl, message) {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
      MessageGroupId: 'ia-tasks', // Para FIFO queues
      MessageDeduplicationId: `${message.taskId}-${Date.now()}`
    });

    await this.sqsClient.send(command);
  }

  async deleteMessage(queueUrl, receiptHandle) {
    const command = new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle
    });

    await this.sqsClient.send(command);
  }
}

module.exports = SQSService;