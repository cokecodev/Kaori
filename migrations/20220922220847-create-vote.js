'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spring: {
        defaultValue:false,
        type: Sequelize.BOOLEAN
      },
      summer: {
        defaultValue:false,
        type: Sequelize.BOOLEAN
      },
      fall: {
        defaultValue:false,
        type: Sequelize.BOOLEAN
      },
      winter: {
        defaultValue:false,
        type: Sequelize.BOOLEAN
      },
      day: {
        defaultValue:false,
        type: Sequelize.BOOLEAN
      },
      night: {
        defaultValue:false,
        type: Sequelize.BOOLEAN
      },
      longevity: {
        type: Sequelize.STRING(128)
      },
      silage: {
        type: Sequelize.STRING(128)
      },
      gender: {
        type: Sequelize.STRING(128)
      },
      ingredient: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Votes');
  }
};