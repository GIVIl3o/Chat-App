const Users = require("../database/users");
const messageRoutes = require("./messages");
const usersRoutes = require("./users");
const jwt = require("jsonwebtoken");

const secretToken = process.env.secredToken || "development secret";

const verifyToken = function verifyToken(io, socket, handlerFunction) {
  return function handleMessage(data, responseFunction) {
    try {
      const decoded = jwt.verify(data.jwt, secretToken);
      return handlerFunction(io, decoded.username, data, responseFunction);
    } catch (err) {
      socket.emit("jwtExpired");
    }
  };
};

function openConnection(socket) {
  try {
    const decoded = jwt.verify(socket.handshake.query.jwt, secretToken);
    Users.findByPk(decoded.username).then(function requestedUser(user) {
      user.update({ socketId: socket.id });
      socket.broadcast.emit("userConnect", { username: user.username });
    });
  } catch (err) {
    socket.emit("jwtExpired");
    socket.disconnect(true);
  }
}

function closeConnection(io, socket) {
  Users.findOne({
    where: {
      socketId: socket.id
    }
  }).then(user => {
    if (user) {
      user.update({ socketId: null });
      io.emit("userDisconnect", { username: user.username });
    }
  });
}

const onConnect = io => {
  return function socketEvents(socket) {
    openConnection(socket);

    socket.on(
      "changePicture",
      verifyToken(io, socket, usersRoutes.socketChangePicture)
    );
    socket.on(
      "changePassword",
      verifyToken(io, socket, usersRoutes.changePassword)
    );
    socket.on("getUsers", verifyToken(io, socket, usersRoutes.getUsers));
    socket.on(
      "getMessages",
      verifyToken(io, socket, messageRoutes.getMessages)
    );
    socket.on("onMessage", verifyToken(io, socket, messageRoutes.onMessage));
    socket.on("disconnect", () => closeConnection(io, socket));

    console.log("user connected");
  };
};

module.exports = onConnect;
