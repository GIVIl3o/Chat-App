const Sequelize = require("sequelize");
const sequelize = require("./index");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const Users = sequelize.define(
  "users",
  {
    username: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    socketId: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {}
);

sequelize.sync().then(async () => {
  const user = await Users.findByPk("alex");

  if (!user)
    bcrypt.hash("123", saltRounds, function(err, passwordHash) {
      const user = {
        username: "alex",
        passwordHash
      };
      Users.create(user);
    });
});

module.exports = Users;
