const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("promptads", "user123", "YourStrong!Passw0rd", {
  host: "localhost",
  dialect: "mssql",
  dialectOptions: {
    options: { encrypt: false }
  },
  pool: {
    max: 10,       // Máximo de conexiones
    min: 1,        // Mínimo
    acquire: 30000, // Tiempo máximo de espera
    idle: 10000     // Tiempo antes de cerrar conexión inactiva
  }
});

module.exports = { sequelize };
