// src/gateways/messaging/publisher.js
const amqplib = require('amqplib');

async function publish(queue, payload) {
  const conn = await amqplib.connect(process.env.RABBIT_URL || 'amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), { persistent: true });
  setTimeout(() => conn.close(), 500);
}

module.exports = { publish };
