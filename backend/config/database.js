const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './profiles.db',
  logging: console.log
});

module.exports = sequelize;