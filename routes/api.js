const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const articlesRouter = require("./articles");
const { commentsRouter } = require("./comments");
const usersRouter = require("./users");
const { send405 } = require("../errors/index");
const { getApiMap } = require("../controllers/api");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter
  .route("/")
  .get(getApiMap)
  .all(send405);

module.exports = apiRouter;
