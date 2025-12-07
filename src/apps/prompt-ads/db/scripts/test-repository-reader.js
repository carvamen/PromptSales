const CampaignRepositorySP = require('../../../../infrastructure/repositories/CampaignRepositorySP');

async function testReader() {
    console.log('📖 TESTEANDO SOLO LECTURA (READ)...\n');
    
    const repository = new CampaignRepositorySP();
    
    try {
        // Pedir el ID a probar (puedes cambiarlo manualmente)
        const campaignId = 2103;
        console.log(`🔍 Buscando campaña con ID: ${campaignId}\n`);
        
        console.log('1. Probando FIND BY ID...');
        const campaign = await repository.findById(campaignId);
        
        if (campaign) {
            console.log(' LECTURA EXITOSA! Campaña encontrada:');
            console.log(`   ID: ${campaign.IdCampaign}`);
            console.log(`   Nombre: ${campaign.name}`);
            console.log(`   Descripción: ${campaign.description}`);
            console.log(`   Organización: ${campaign.OrganizationName}`);
            console.log(`   Fecha inicio: ${campaign.startsAt}`);
            console.log(`   Fecha fin: ${campaign.endsAt}`);
        } else {
            console.log(' Campaña no encontrada');
            console.log(' Ejecuta primero el test de escritura para crear datos');
        }

        return;
        
    } catch (error) {
        console.error('❌ ERROR EN LECTURA:', error.message);
    }
}

testReader();