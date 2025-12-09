const Campaign = require('../../models/Campaign');

class CampaignRepositoryORM {
  // ESCRITURA - CON CONVERSIÓN EXPLÍCITA
  async create(campaignData) {
    try {
      // ✅ CONVERTIR explícitamente a formato SQL Server
      const startsAt = this.formatDateForSQL(campaignData.startsAt);
      const endsAt = this.formatDateForSQL(campaignData.endsAt);
      
      console.log('📅 Fechas convertidas:', { startsAt, endsAt });
      
      const campaign = await Campaign.create({
        name: campaignData.name,
        description: campaignData.description,
        organizationId: campaignData.organizationId,
        cityId: campaignData.cityId,
        startsAt: startsAt,
        endsAt: endsAt,
        status: campaignData.status || 1
      });
      
      return campaign.id;
    } catch (error) {
      console.error('❌ Error detallado en ORM:', error);
      throw new Error(`Error creating campaign: ${error.message}`);
    }
  }

  // ✅ MÉTODO PARA FORMATEAR FECHAS PARA SQL SERVER
  formatDateForSQL(dateString) {
    if (!dateString) return null;
    
    // Si ya es Date object, usarlo directamente
    if (dateString instanceof Date) {
      return dateString;
    }
    
    // Si es string, convertir a Date
    const date = new Date(dateString);
    
    // Validar que sea una fecha válida
    if (isNaN(date.getTime())) {
      throw new Error(`Fecha inválida: ${dateString}`);
    }
    
    return date;
  }

  // LECTURA (mantener igual)
  async findById(campaignId) {
    try {
      const campaign = await Campaign.findByPk(campaignId);
      
      if (!campaign) return null;
      
      return {
        IdCampaign: campaign.id,
        name: campaign.name,
        description: campaign.description,
        IdOrganization: campaign.organizationId,
        IdCity: campaign.cityId,
        startsAt: campaign.startsAt,
        endsAt: campaign.endsAt,
        IdCampaignStatus: campaign.status,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt
      };
    } catch (error) {
      throw new Error(`Error finding campaign: ${error.message}`);
    }
  }

  async findByOrganization(organizationId) {
    try {
      const campaigns = await Campaign.findAll({
        where: { organizationId },
        order: [['createdAt', 'DESC']]
      });
      
      return campaigns.map(camp => ({
        IdCampaign: camp.id,
        name: camp.name,
        description: camp.description,
        startsAt: camp.startsAt,
        endsAt: camp.endsAt
      }));
    } catch (error) {
      throw new Error(`Error finding campaigns by organization: ${error.message}`);
    }
  }
}

module.exports = CampaignRepositoryORM;