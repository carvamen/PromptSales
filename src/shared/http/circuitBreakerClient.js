class CircuitBreaker {
  constructor({ failureThreshold = 5, recoveryTime = 10000 }) {
    this.failureThreshold = failureThreshold; // número máximo de fallos permitidos
    this.recoveryTime = recoveryTime; // tiempo de espera antes de intentar reabrir (ms)
    this.failureCount = 0;
    this.state = 'CLOSED'; // CLOSED | OPEN | HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async call(serviceCall, fallback) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF_OPEN';
      } else {
        return fallback('Circuit breaker is OPEN. Using fallback response.');
      }
    }

    try {
      const result = await serviceCall();
      this.success();
      return result;
    } catch (error) {
      this.failure();
      return fallback(error.message);
    }
  }

  success() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  failure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.recoveryTime;
      console.warn(`Circuit breaker OPENED. Next attempt at ${new Date(this.nextAttempt).toISOString()}`);
    }
  }
}

module.exports = CircuitBreaker;
