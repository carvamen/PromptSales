import { CircuitBreaker } from '../utils/CircuitBreaker.js';
import { CRMChannelClient } from '../clients/CRMChannelClient.js';

const client = new CRMChannelClient();
const breaker = new CircuitBreaker({
  failureThreshold: 3,
  recoveryTime: 30000,
  key: 'crm'
});

export class CRMProxy {
  async getCustomer(id) {
    return breaker.call(() => client.getCustomerData(id));
  }
}
