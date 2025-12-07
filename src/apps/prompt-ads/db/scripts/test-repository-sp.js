const CampaignRepositorySP = require('../../../../infrastructure/repositories/CampaignRepositorySP');

async function testRepository() {
    console.log('🧪 TESTEANDO REPOSITORY CON STORED PROCEDURES...\n');
    
    const repository = new CampaignRepositorySP();
    
    try {
        // 1. PRUEBA DE ESCRITURA (CREATE)
        console.log('1. Probando CREATE...');
        const newCampaign = {
            organizationId: 1,
            name: 'Campaña de Prueba SP',
            description: 'Esta es una campaña de prueba con Stored Procedures',
            cityId: 1,  
            startsAt: '2024-03-01',
            endsAt: '2024-03-31'
        };
        
        const newId = await repository.create(newCampaign);
        console.log(`✅ CREATE EXITOSO! Nuevo ID: ${newId}\n`);
        
        // 2. PRUEBA DE LECTURA (READ)
        console.log('2. Probando FIND BY ID...');
        const campaign = await repository.findById(newId);
        
        if (campaign) {
            console.log('✅ READ EXITOSO! Campaña encontrada:');
            console.log(`   ID: ${campaign.IdCampaign}`);
            console.log(`   Nombre: ${campaign.name}`);
            console.log(`   Descripción: ${campaign.description}`);
            console.log(`   Organización: ${campaign.OrganizationName}`);
        } else {
            console.log('❌ READ FALLIDO! Campaña no encontrada');
        }
        
    } catch (error) {
        console.error('❌ ERROR EN PRUEBA:', error.message);
        console.error('Detalles:', error);
    }
}

// Ejecutar prueba
testRepository();