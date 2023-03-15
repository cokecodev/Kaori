'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Comment, {foreignKey: 'userId'})
      User.hasMany(models.Vote, {foreignKey: 'userId'})

    }
  }
  User.init({
    username: DataTypes.STRING,
    nickname: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};