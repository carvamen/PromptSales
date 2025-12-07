const SubscriptionRepositoryORM = require('../../../../infrastructure/repositories/SubscriptionRepositoryORM');
const { sequelize } = require('../sequlize-config');

async function testSubscriptionReader() {
  console.log('📖 TESTEANDO LECTURA CON ORM - SUBSCRIPTIONS\n');
  
  const repository = new SubscriptionRepositoryORM();
  
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la BD con Sequelize\n');
    
    // 1. Leer todas las subscriptions
    console.log('1. Probando FIND ALL...');
    const allSubscriptions = await repository.findAll();
    
    console.log(`\n TOTAL SUBSCRIPTIONS: ${allSubscriptions.length}`);
    allSubscriptions.forEach(sub => {
      console.log(`   ID: ${sub.IdSubscription} | ${sub.name} - ${sub.description}`);
    });
    
    // 2. Leer una subscription específica
    if (allSubscriptions.length > 0) {
      const firstId = allSubscriptions[0].IdSubscription;
      console.log(`\n2. Probando FIND BY ID (ID: ${firstId})...`);
      
      const singleSubscription = await repository.findById(firstId);
      if (singleSubscription) {
        console.log('      SUBSCRIPTION ENCONTRADA:');
        console.log(`      ID: ${singleSubscription.IdSubscription}`);
        console.log(`      Nombre: ${singleSubscription.name}`);
        console.log(`      Descripción: ${singleSubscription.description}`);
      }
    }
    
    // 3. Probar con ID que no existe
    console.log('\n3. Probando FIND BY ID con ID inexistente...');
    const notFound = await repository.findById(9999);
    if (!notFound) {
      console.log('    Comportamiento correcto - Subscription no encontrada');
    }
    
  } catch (error) {
    console.error(' ERROR GENERAL:', error.message);
  } finally {
    await sequelize.close();
    console.log('\n Conexión cerrada');
  }
}

testSubscriptionReader();