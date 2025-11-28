const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("promptads", "user123", "YourStrong!Passw0rd", {
  host: "localhost",
  dialect: "mssql",
  dialectOptions: {
    options: { encrypt: false }
  }
});

module.exports = { sequelize };
