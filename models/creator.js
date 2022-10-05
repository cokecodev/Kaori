'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Creator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Creator.hasMany(models.Perfume, {foreignKey: 'creatorId'})

    }
  }
  Creator.init({
    creatorName: DataTypes.STRING,
    creatorIntro: DataTypes.TEXT,
    nationality: DataTypes.STRING,
    memo: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Creator',
  });
  return Creator;
};