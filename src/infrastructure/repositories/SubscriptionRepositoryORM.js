const Subscription = require('../../../src/apps/prompt-ads/src/models/Subscription');

class SubscriptionRepositoryORM {
  // ESCRITURA - CREATE
  async create(subscriptionData) {
    try {
      console.log('📝 Creando subscription con ORM...');
      
      const subscription = await Subscription.create({
        name: subscriptionData.name,
        description: subscriptionData.description
      });
      
      console.log('✅ Subscription creada exitosamente');
      return subscription.id;
      
    } catch (error) {
      console.error('❌ Error creando subscription:', error.message);
      throw new Error(`Error creating subscription: ${error.message}`);
    }
  }

  // LECTURA - FIND BY ID
  async findById(subscriptionId) {
    try {
      console.log(`🔍 Buscando subscription ID: ${subscriptionId}`);
      
      const subscription = await Subscription.findByPk(subscriptionId);
      
      if (!subscription) {
        console.log('❌ Subscription no encontrada');
        return null;
      }
      
      console.log('✅ Subscription encontrada');
      return {
        IdSubscription: subscription.id,
        name: subscription.name,
        description: subscription.description
      };
      
    } catch (error) {
      console.error('❌ Error buscando subscription:', error.message);
      throw new Error(`Error finding subscription: ${error.message}`);
    }
  }

  // LECTURA - FIND ALL
  async findAll() {
    try {
      console.log('🔍 Buscando todas las subscriptions...');
      
      const subscriptions = await Subscription.findAll({
        order: [['id', 'ASC']]
      });
      
      console.log(`✅ Encontradas ${subscriptions.length} subscriptions`);
      return subscriptions.map(sub => ({
        IdSubscription: sub.id,
        name: sub.name,
        description: sub.description
      }));
      
    } catch (error) {
      console.error('❌ Error buscando subscriptions:', error.message);
      throw new Error(`Error finding subscriptions: ${error.message}`);
    }
  }
}

module.exports = SubscriptionRepositoryORM;