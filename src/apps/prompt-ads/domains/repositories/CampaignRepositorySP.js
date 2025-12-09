const { sql, getPool } = require('../../db/sql-server-connection');

class CampaignRepositorySP {
    constructor() {
    /*
        PREVISTAS DE CACHE (no implementado por falta de infraestructura):

        - Aquí se inyectaría Redis o Memcached:
            this.cache = new RedisClient();

        - TTL recomendado: 300 segundos (5 minutos):
            this.cacheTTL = 300;

        - Estrategia: Cache-Aside
            1. Buscar primero en cache
            2. Si no está, consultar BD
            3. Guardar resultado para futuras consultas
            4. Invalidar en operaciones de escritura

        - NOTA: Si el cache falla → fallback a BD sin afectar operación.

        - NOTA: Los SPs facilitan saber EXACTAMENTE qué invalidar
            después de cada operación (alta, edición, etc.).
    */
    }
    
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

        // INVALIDAR CACHE DESPUÉS DE ESCRIBIR
        // await this.cache.del("campaigns:list");
        // await this.cache.del(`campaign:${result.id}`);

        return result.recordset[0].NewCampaignId;
    }

    async findById(campaignId) {
        const pool = await getPool();
        
         // 1. CACHE FIRST (solo comentado)
        // const cached = await this.cache.get(`campaign:${campaignId}`);
        // if (cached) return JSON.parse(cached);

        const request = pool.request();
        request.input('CampaignId', campaignId);
        
        const result = await request.execute('usp_Campaign_GetById');

        // 3. GUARDAR EN CACHE PARA SIGUIENTES LECTURAS — PREVISTO
        // if (result) {
        //     await this.cache.setex(
        //         `campaign:${campaignId}`,
        //         this.cacheTTL,
        //         JSON.stringify(result)
        //     );
        // }

        return result.recordset[0] || null;
    }
}

module.exports = CampaignRepositorySP;