import { CircuitBreaker } from '../utils/CircuitBreaker.js';
import { ContentChannelClient } from '../clients/ContentChannelClient.js';

const client = new ContentChannelClient();
const breaker = new CircuitBreaker({
  failureThreshold: 3,
  recoveryTime: 30000,
  key: 'content'
});

export class ContentProxy {
  async getContent(id) {
    return breaker.call(() => client.getContent(id));
  }
}
