const axios = require('axios');
const redis = require('redis');

class CircuitBreakerClient {
  constructor(serviceName, options = {}) {
    this.serviceName = serviceName;
    this.failureThreshold = options.failureThreshold || 5;
    this.recoveryTime = options.recoveryTime || 30000;
    this.timeout = options.timeout || 10000;
    this.redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });
    this.redisClient.connect();
  }

  async call(serviceCall, fallback) {
    const state = await this.getState();
    
    if (state === 'OPEN') {
      const nextAttempt = await this.redisClient.get(`${this.serviceName}:nextAttempt`);
      if (Date.now() < parseInt(nextAttempt)) {
        return fallback('Circuit breaker OPEN');
      }
      await this.setState('HALF_OPEN');
    }

    try {
      const result = await this.executeWithTimeout(serviceCall);
      await this.recordSuccess();
      return result;
    } catch (error) {
      await this.recordFailure();
      return fallback(error.message);
    }
  }

  async getState() {
    return await this.redisClient.get(`${this.serviceName}:state`) || 'CLOSED';
  }

  async setState(state) {
    await this.redisClient.set(`${this.serviceName}:state`, state);
  }

  async recordSuccess() {
    await this.redisClient.set(`${this.serviceName}:failures`, '0');
    await this.setState('CLOSED');
  }

  async recordFailure() {
    const currentFailures = parseInt(await this.redisClient.get(`${this.serviceName}:failures`) || '0');
    const newFailures = currentFailures + 1;
    
    await this.redisClient.set(`${this.serviceName}:failures`, newFailures.toString());
    
    if (newFailures >= this.failureThreshold) {
      await this.setState('OPEN');
      await this.redisClient.set(
        `${this.serviceName}:nextAttempt`, 
        (Date.now() + this.recoveryTime).toString()
      );
    }
  }

  async executeWithTimeout(serviceCall) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout'));
      }, this.timeout);

      serviceCall()
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeout));
    });
  }
}

// Lambda handler
const adsCircuitBreaker = new CircuitBreakerWithRedis('ads-service', {
  failureThreshold: 3,
  recoveryTime: 15000
});

exports.handler = async (event) => {
  const data = await adsCircuitBreaker.call(
    async () => {
      const response = await axios.get('http://your-alb-url/campaigns');
      return response.data;
    },
    (error) => ({
      campaigns: [],
      message: 'Fallback: Service unavailable',
      error: error
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};