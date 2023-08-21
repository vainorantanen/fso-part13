/*
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Readlistingbelong extends Model {}

Readlistingbelong.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  readlistingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'readlistings', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'readlistingbelong'
})

module.exports = Readlistingbelong
*/