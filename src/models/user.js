'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Chatbox, { as: 'customerChats', foreignKey: 'customer_id' });
      User.hasMany(models.Chatbox, { as: 'adminChats', foreignKey: 'admin_id' });
      User.hasMany(models.Message, { foreignKey: 'sender_id' });
    }
  }
  User.init({
    email: DataTypes.STRING,
    fullName: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    roleId: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};