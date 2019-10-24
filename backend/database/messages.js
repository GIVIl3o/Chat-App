const Sequelize = require("sequelize");
const sequelize = require("./index");

const Messages = sequelize.define(
  "messages",
  {
    from: {
      type: Sequelize.STRING,
      allowNull: false
    },
    to: {
      type: Sequelize.STRING,
      allowNull: false
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {}
);

module.exports = Messages;
