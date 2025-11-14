import axios from 'axios';

export class ContentChannelClient {
  constructor() {
    this.baseUrl = process.env.CONTENT_API_URL;
  }

  async getContent(id) {
    const res = await axios.get(`${this.baseUrl}/content/${id}`);
    return res.data;
  }
}
