const topicsRouter = require("express").Router();
const { sendTopics, postTopic } = require("../controllers/topics");
const { send405 } = require("../errors/index");

topicsRouter
  .route("/")
  .get(sendTopics)
  .post(postTopic)
  .all(send405);

module.exports = topicsRouter;
