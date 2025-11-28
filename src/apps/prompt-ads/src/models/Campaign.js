const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sequlize-config');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'IdCampaign'
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: 'name'
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'description'
  },
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'IdOrganization'
  },
  cityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'IdCity'
  },
  startsAt: {
    type: DataTypes.DATE,  // ✅ Usar DATEONLY para solo fecha
    allowNull: false,
    field: 'startsAt',
    get() {
      // ✅ Forzar formato YYYY-MM-DD al obtener
      const rawValue = this.getDataValue('startsAt');
      return rawValue ? rawValue.toISOString().split('T')[0] : null;
    }
  },
  endsAt: {
    type: DataTypes.DATE,  // ✅ Usar DATEONLY para solo fecha
    allowNull: false,
    field: 'endsAt',
    get() {
      // ✅ Forzar formato YYYY-MM-DD al obtener
      const rawValue = this.getDataValue('endsAt');
      return rawValue ? rawValue.toISOString().split('T')[0] : null;
    }
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    field: 'IdCampaignStatus'
  }
}, {
  tableName: 'PACampaigns',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Campaign;