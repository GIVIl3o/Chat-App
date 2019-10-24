const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const io = require("socket.io")(app.listen(3001));

const usersRoutes = require("./routes/users");

app.use(cors()); // not necessary after deployment

app.use("/profiles", express.static("profiles"));

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.socketIO = io;
  next();
});

app.use(usersRoutes.router);

app.get("*", (req, res) => {
  res.redirect("/");
});

const sockets = require("./routes/sockets");
io.on("connection", sockets(io));
