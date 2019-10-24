const express = require("express");
const jwt = require("jsonwebtoken");
const upload = require("multer")();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const Users = require("../database/users");

const router = express.Router();

const secretToken = process.env.secredToken || "development secret";
const expiresIn = 60 * 60 * 24 * 7;
//const expiresIn = 10;
const saltRounds = 10;

const profileFolder = "profiles";

router.post("/verifyUser", async function(req, res) {
  const user = await Users.findByPk(req.body.username);
  if (user && (await bcrypt.compare(req.body.password, user.passwordHash))) {
    res.send({
      jwt: jwt.sign({ username: req.body.username }, secretToken, { expiresIn })
    });
  } else res.status(401).send({ errorMessage: "Wrong username or password" });
});

router.post("/registerUser", upload.single("image"), async function(req, res) {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = {
      username: req.body.username,
      passwordHash
    };
    const user = await Users.create(newUser);
    const filename = req.body.username;
    const curPath = path.join(__dirname, "..", profileFolder, filename);
    fs.writeFile(curPath, req.file.buffer, err => console.log(err));
    req.socketIO.emit("userCreated", { username: user.username });
    res.status(201).send({
      jwt: jwt.sign({ username: req.body.username }, secretToken, {
        expiresIn
      })
    });
  } catch (e) {
    res.status(401).send({ errorMessage: "username already taken" });
  }
});

const socketChangePicture = (io, username, data, responseFunction) => {
  const curPath = path.join(__dirname, "..", profileFolder, username);
  fs.writeFile(curPath, data.image, err => {});
  io.sockets.emit(`ChangeProfile#${username}`);
  responseFunction({ profileChanged: true });
};

const changePassword = async (io, username, data, responseFunction) => {
  const user = await Users.findByPk(username);
  if (await bcrypt.compare(data.currentPassword, user.passwordHash)) {
    const passwordHash = await bcrypt.hash(data.newPassword, saltRounds);
    user.update({ passwordHash });
    responseFunction({
      success: true,
      message: "Password changed succesfully"
    });
  } else {
    responseFunction({ success: false, message: "Wrong password" });
  }
};

const getUsers = (io, username, data, responseFunction) => {
  Users.findAll({ attributes: ["username", "socketId"] }).then(users => {
    const reduceUser = user => ({
      username: user.dataValues.username,
      online: user.dataValues.socketId !== null
    });
    const filterYourself = user => user.username !== username;
    responseFunction(users.map(reduceUser).filter(filterYourself));
  });
};

module.exports = {
  router,
  socketChangePicture,
  changePassword,
  getUsers
};
