const articlesRouter = require("express").Router();
const {
  sendArticles,
  sendArticleById,
  patchArticleById,
  postArticle,
  deleteArticleById
} = require("../controllers/articles");
const { articleIdCommentRouter } = require("./comments");
const { send405 } = require("../errors/index");

articlesRouter
  .route("/")
  .get(sendArticles)
  .post(postArticle)
  .all(send405);

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById)
  .all(send405);

articlesRouter.use("/:article_id/comments", articleIdCommentRouter);

module.exports = articlesRouter;
