const Messages = require("../database/messages");
const Users = require("../database/users");
const Op = require("sequelize").Op;

const getMessages = (io, username, message, responseFunction) => {
  Messages.findAll({
    where: {
      from: { [Op.or]: [username, message.sender] },
      to: { [Op.or]: [username, message.sender] }
    },
    order: [["createdAt", "DESC"]],
    limit: message.count,
    offset: message.offset
  }).then(responseFunction);
};

const onMessage = (io, username, message, responseFunction) => {
  Messages.create({
    from: username,
    to: message.to,
    message: message.message
  }).then(function messageInserted(insertedMessage) {
    function sendMessage(receiver) {
      Users.findByPk(receiver).then(function messagedUser(user) {
        if (user.socketId) {
          io.to(user.socketId).emit(
            `receiveMessage`,
            insertedMessage.dataValues
          );
        }
      });
    }

    sendMessage(username);
    sendMessage(message.to);
  });
};

module.exports = {
  onMessage,
  getMessages
};
