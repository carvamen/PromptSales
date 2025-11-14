import redisClient from '/redisClient.js';

export class CircuitBreaker {
  constructor({ failureThreshold, recoveryTime, key }) {
    this.failureThreshold = failureThreshold;
    this.recoveryTime = recoveryTime; // ms
    this.key = `cb:${key}`;
  }

  async getState() {
    const data = await redisClient.hGetAll(this.key);
    return {
      failureCount: parseInt(data.failureCount || '0'),
      state: data.state || 'CLOSED',
      nextAttempt: parseInt(data.nextAttempt || '0')
    };
  }

  async setState(state) {
    await redisClient.hSet(this.key, {
      failureCount: state.failureCount.toString(),
      state: state.state,
      nextAttempt: state.nextAttempt.toString()
    });
  }

  async call(fn) {
    const state = await this.getState();
    const now = Date.now();

    if (state.state === 'OPEN') {
      if (now > state.nextAttempt) {
        // Move to HALF-OPEN
        await this.setState({ ...state, state: 'HALF_OPEN' });
      } else {
        throw new Error('Circuit is OPEN, request blocked');
      }
    }

    try {
      const result = await fn();
      await this.success();
      return result;
    } catch (err) {
      await this.failure();
      throw err;
    }
  }

  async success() {
    await this.setState({
      failureCount: 0,
      state: 'CLOSED',
      nextAttempt: 0
    });
  }

  async failure() {
    const state = await this.getState();
    const failures = state.failureCount + 1;

    if (failures >= this.failureThreshold) {
      await this.setState({
        failureCount: failures,
        state: 'OPEN',
        nextAttempt: Date.now() + this.recoveryTime
      });
    } else {
      await this.setState({
        failureCount: failures,
        state: state.state,
        nextAttempt: state.nextAttempt
      });
    }
  }
}
