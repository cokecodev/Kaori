'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Comment-UserId
    await queryInterface.addColumn(
    'Comments',
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

    // Comment-PerfumeId
    await queryInterface.addColumn(
      'Comments',
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
    
    // Perfumes-CreatorId
    await queryInterface.addColumn(
      'Perfumes',
      'creatorId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Creators',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      }
    );

    // Perfumes-BrandId
    await queryInterface.addColumn(
      'Perfumes',
      'brandId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Brands',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Perfumes','brandId');
    await queryInterface.removeColumn('Perfumes','creatorId');
    await queryInterface.removeColumn('Comments','perfumeId');
    await queryInterface.removeColumn('Comments','userId');
  }
};
