const CampaignRepositorySP = require('../../src/domains/infraestructure/repositories//CampaignRepositorySP');

async function testWriter() {
    console.log('🖊️  TESTEANDO SOLO ESCRITURA (CREATE)...\n');
    
    const repository = new CampaignRepositorySP();
    
    try {
        const newCampaign = {
            organizationId: 1,
            name: 'Campaña Solo Escritura Test',
            description: 'Probando solo operaciones de escritura',
            cityId: 1,  
            startsAt: '2024-03-01',
            endsAt: '2024-03-31'
        };
        
        console.log('   Creando nueva campaña...');
        const newId = await repository.create(newCampaign);
        
        console.log('   ESCRITURA EXITOSA!');
        console.log(`   Nuevo ID generado: ${newId}`);
        console.log(`   Nombre: ${newCampaign.name}`);
        console.log(`   Organización: ${newCampaign.organizationId}`);
        
        // Guardar el ID para usarlo en el test de lectura
        console.log(`\n ID ${newId} listo para probar lectura`);
        
    } catch (error) {
        console.error(' ERROR EN ESCRITURA:', error.message);
    }
}

testWriter();