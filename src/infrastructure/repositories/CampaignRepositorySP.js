const { sql, getPool } = require('../../apps/prompt-ads/db/sql-server-connection');

class CampaignRepositorySP {
    async create(campaignData) {
        const pool = await getPool();
        
        const request = pool.request();
        request.input('IdOrganization', campaignData.organizationId);
        request.input('Name', campaignData.name);
        request.input('Description', campaignData.description);
        request.input('IdCity', campaignData.cityId);
        request.input('StartsAt', campaignData.startsAt);
        request.input('EndsAt', campaignData.endsAt);
        request.input('IdCampaignStatus', campaignData.status || 1);
        
        const result = await request.execute('usp_Campaign_Create');
        return result.recordset[0].NewCampaignId;
    }

    async findById(campaignId) {
        const pool = await getPool();
        
        const request = pool.request();
        request.input('CampaignId', campaignId);
        
        const result = await request.execute('usp_Campaign_GetById');
        return result.recordset[0] || null;
    }
}

module.exports = CampaignRepositorySP;