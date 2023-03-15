'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // vote-UserId
    await queryInterface.addColumn(
      'Votes',
      'userId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      }
    );

    // vote-PerfumeId
    await queryInterface.addColumn(
      'Votes',
      'perfumeId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Perfumes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Votes','userId');
    await queryInterface.removeColumn('Votes','perfumeId');
  }
};
