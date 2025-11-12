class MessageBusClient {
  constructor(deps) { this.deps = deps; }
  async publish(topic, msg) {
    // implementa con Kafka/Rabbit/SQS. Ejemplo minimal: push a redis list
    return this.deps.redis.lpush(topic, JSON.stringify(msg));
  }
  async subscribe(topic, handler) {
    // implementation varia según broker
  }
}

module.exports = MessageBusClient;
