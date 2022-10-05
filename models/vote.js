'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    static associate(models) {
      // define association here
      Vote.belongsTo(models.Perfume,{foreignKey: 'perfumeId'})
      Vote.belongsTo(models.User,{foreignKey: 'userId'})

    }
  }
  Vote.init({
    spring: DataTypes.BOOLEAN,
    summer: DataTypes.BOOLEAN,
    fall: DataTypes.BOOLEAN,
    winter: DataTypes.BOOLEAN,
    day: DataTypes.BOOLEAN,
    night: DataTypes.BOOLEAN,
    longevity: DataTypes.STRING,
    silage: DataTypes.STRING,
    gender: DataTypes.STRING,
    ingredient: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Vote',
  });
  return Vote;
};