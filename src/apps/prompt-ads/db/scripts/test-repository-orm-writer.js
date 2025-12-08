const SubscriptionRepositoryORM = require('../../src/domains/infraestructure/repositories/SubscriptionRepositoryORM');
const { sequelize } = require('../sequlize-config');

async function testSubscriptionWriter() {
  console.log('🖊️  TESTEANDO ESCRITURA CON ORM - SUBSCRIPTIONS\n');
  
  const repository = new SubscriptionRepositoryORM();
  
  try {
    // Conectar a la BD
    await sequelize.authenticate();
    console.log('✅ Conectado a la BD con Sequelize\n');
    
    // Datos de prueba
    const testSubscriptions = [
      {
        name: 'Plan Básico',
        description: 'Plan básico para pequeñas empresas'
      },
      {
        name: 'Plan Premium', 
        description: 'Plan premium con todas las características'
      },
      {
        name: 'Plan Enterprise',
        description: 'Plan enterprise para grandes organizaciones'
      }
    ];
    
    // Probar crear cada subscription
    for (let i = 0; i < testSubscriptions.length; i++) {
      const subData = testSubscriptions[i];
      
      console.log(`\n${i + 1}. Creando: ${subData.name}`);
      console.log('   Descripción:', subData.description);
      
      try {
        const newId = await repository.create(subData);
        console.log(`   ✅ CREADA EXITOSAMENTE - ID: ${newId}`);
      } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ ERROR GENERAL:', error.message);
  } finally {
    await sequelize.close();
    console.log('\n🔚 Conexión cerrada');
  }
}

testSubscriptionWriter();