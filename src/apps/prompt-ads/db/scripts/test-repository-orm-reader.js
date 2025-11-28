const CampaignRepositoryORM = require('../../../../infrastructure/repositories/CampaignRepositoryORM');
const { sequelize } = require('../sequlize-config');

async function testORMReader() {
  console.log('📖 TESTEANDO LECTURA CON ORM (SEQUELIZE)...\n');
  
  const repository = new CampaignRepositoryORM();
  
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la BD con Sequelize\n');
    
    const campaignId = process.argv[2] || 1;
    console.log(`🔍 Buscando campaña ID: ${campaignId} con ORM\n`);
    
    console.log('1. Probando FIND BY ID...');
    const campaign = await repository.findById(campaignId);
    
    if (campaign) {
      console.log('✅ LECTURA CON ORM EXITOSA!');
      console.log(`   ID: ${campaign.IdCampaign}`);
      console.log(`   Nombre: ${campaign.name}`);
      console.log(`   Descripción: ${campaign.description}`);
      console.log(`   Creado: ${campaign.createdAt}`);
    } else {
      console.log('❌ Campaña no encontrada con ORM');
    }
    
    console.log('\n2. Probando FIND BY ORGANIZATION...');
    const orgCampaigns = await repository.findByOrganization(1);
    console.log(`✅ Encontradas ${orgCampaigns.length} campañas con ORM`);
    
  } catch (error) {
    console.error('❌ ERROR EN ORM:', error.message);
  } finally {
    await sequelize.close();
  }
}

testORMReader();