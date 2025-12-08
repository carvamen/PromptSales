const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sequlize-config');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'IdSubscription'
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: 'name'
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'description'
  }
}, {
  tableName: 'PASubscriptions',
  timestamps: false // ✅ No hay createdAt/updatedAt en esta tabla
});

module.exports = Subscription;