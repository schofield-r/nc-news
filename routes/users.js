const usersRouter = require("express").Router();
const {
  sendUserByUsername,
  postUser,
  getUsers
} = require("../controllers/users");
const { send405 } = require("../errors/index");

usersRouter
  .route("/")
  .post(postUser)
  .get(getUsers)
  .all(send405);

usersRouter
  .route("/:username")
  .get(sendUserByUsername)
  .all(send405);

module.exports = usersRouter;
