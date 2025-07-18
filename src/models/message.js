'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.Chatbox, { foreignKey: 'chat_room_id' });
      Message.belongsTo(models.User, { foreignKey: 'sender_id' });
    }
  }
  Message.init({
    chat_room_id: DataTypes.INTEGER,
    sender_id: DataTypes.INTEGER,
    sender_role:DataTypes.STRING,
    message:DataTypes.TEXT

  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'message',
  });
  return Message;
};