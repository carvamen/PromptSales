import { CircuitBreaker } from '../utils/CircuitBreaker.js';
import { AdsChannelClient } from '../clients/AdsChannelClient.js';

const client = new AdsChannelClient();
const breaker = new CircuitBreaker({
  failureThreshold: 3,
  recoveryTime: 30000,
  key: 'ads'
});

export class AdsProxy {
  async getAdCampaign(id) {
    return breaker.call(() => client.getAdCampaign(id));
  }
}
