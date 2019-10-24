const Sequelize = require("sequelize");

const hostname = process.env.databaseHostname || "localhost";

const sequelize = new Sequelize(
  `postgresql://postgres:postgres@${hostname}/messaging`
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:");
    process.exit(); // will restart container
  });

//sequelize.sync();

//sequelize.sync({ force: true });

module.exports = sequelize;
