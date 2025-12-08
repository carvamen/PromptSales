const Subscription = require('../../models/Subscription');

class SubscriptionRepositoryORM {
  constructor() {
    /*
      PREVISTAS DE CACHE (no implementado por falta de infraestructura):

      - Aquí se inyectaría Redis/Memcached:
            this.cache = new RedisClient();

      - TTL recomendado:
            this.cacheTTL = 300; // 5 minutos

      - Estrategia Cache-Aside:
            1. Buscar primero en cache
            2. Si no está → consultar BD vía ORM
            3. Guardar resultado en cache
            4. Invalidar cache cuando se crean/actualizan registros

      - NOTA DE CONNECTION POOL:
        Sequelize ya maneja internamente un pool configurado en `sequelize-config.js`.
        (max, min, idleTimeout, acquireTimeout)
        Por eso este repository ya trabaja sobre un pool sin configurarlo aquí.
    */
  }
  
  // ESCRITURA - CREATE
  async create(subscriptionData) {
    try {
      console.log(' Creando subscription con ORM...');
      
      const subscription = await Subscription.create({
        name: subscriptionData.name,
        description: subscriptionData.description
      });
      
      console.log(' Subscription creada exitosamente');

      // Invalidar cache luego de escritura (solo previsto)
      // await this.cache.del("subscriptions:list");
      // await this.cache.del(`subscription:${subscription.id}`);

      return subscription.id;
      
    } catch (error) {
      console.error(' Error creando subscription:', error.message);
      throw new Error(`Error creating subscription: ${error.message}`);
    }
  }

  // LECTURA - FIND BY ID
  async findById(subscriptionId) {
    try {
      console.log(` Buscando subscription ID: ${subscriptionId}`);
      
      // 1. Cache-first (previsto)
      // const cached = await this.cache.get(`subscription:${subscriptionId}`);
      // if (cached) return JSON.parse(cached);

      const subscription = await Subscription.findByPk(subscriptionId);
      
      if (!subscription) {
        console.log(' Subscription no encontrada');
        return null;
      }

      const data = {
        IdSubscription: subscription.id,
        name: subscription.name,
        description: subscription.description
      };
      
      console.log(' Subscription encontrada');

      // 2. Guardar en cache (previsto)
      // await this.cache.setex(
      //   `subscription:${subscriptionId}`,
      //   this.cacheTTL,
      //   JSON.stringify(data)
      // );

      return data;

      
    } catch (error) {
      console.error(' Error buscando subscription:', error.message);
      throw new Error(`Error finding subscription: ${error.message}`);
    }
  }

  // LECTURA - FIND ALL
  async findAll() {
    try {
      console.log(' Buscando todas las subscriptions...');

      // 1. Cache-first (previsto)
      // const cached = await this.cache.get("subscriptions:list");
      // if (cached) return JSON.parse(cached);
      
      const subscriptions = await Subscription.findAll({
        order: [['id', 'ASC']]
      });
      
      const result = subscriptions.map(sub => ({
        IdSubscription: sub.id,
        name: sub.name,
        description: sub.description
      }));

      console.log(` Encontradas ${subscriptions.length} subscriptions`);
      
      // 2. Guardar en cache (previsto)
      // await this.cache.setex("subscriptions:list", this.cacheTTL, JSON.stringify(result));

      return result;
      
    } catch (error) {
      console.error(' Error buscando subscriptions:', error.message);
      throw new Error(`Error finding subscriptions: ${error.message}`);
    }
  }
}

module.exports = SubscriptionRepositoryORM;