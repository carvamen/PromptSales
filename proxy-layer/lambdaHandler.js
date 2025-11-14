import { CRMProxy } from './proxies/CRMProxy.js';
import { AdsProxy } from './proxies/AdsProxy.js';
import { ContentProxy } from './proxies/ContentProxy.js';

const crmProxy = new CRMProxy();
const adsProxy = new AdsProxy();
const contentProxy = new ContentProxy();

export const handler = async (event) => {
  try {
    const { service, payload } = event;

    switch (service) {
      case 'crm':
        return await crmProxy.getCustomer(payload.id);
      case 'ads':
        return await adsProxy.getAdCampaign(payload.id);
      case 'content':
        return await contentProxy.getContent(payload.id);
      default:
        throw new Error(`Unknown service: ${service}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
