import axios from 'axios';

export class CRMChannelClient {
  constructor() {
    this.baseUrl = process.env.CRM_API_URL;
  }

  async getCustomerData(id) {
    const res = await axios.get(`${this.baseUrl}/customers/${id}`);
    return res.data;
  }
}
