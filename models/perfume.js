'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Perfume extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Perfume.belongsTo(models.Creator, {foreignKey: 'creatorId'})
      Perfume.belongsTo(models.Brand, {foreignKey: 'brandId'})
      Perfume.hasMany(models.Vote, {foreignKey: 'perfumeId'})
    }
  }
  Perfume.init({
    perfumeName:DataTypes.STRING,
    ingredient: DataTypes.TEXT,
    group: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Perfume',
  });
  return Perfume;
};