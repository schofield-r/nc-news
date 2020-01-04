const commentsRouter = require("express").Router();
const articleIdCommentRouter = require("express").Router({ mergeParams: true });
const { send405 } = require("../errors/index");

const {
  deleteCommentById,
  changeCommentVoteById
} = require("../controllers/comments");
const {
  getComments,
  postCommentOnArticle
} = require("../controllers/articles");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(changeCommentVoteById)
  .all(send405);

articleIdCommentRouter
  .route("/")
  .get(getComments)
  .post(postCommentOnArticle)
  .all(send405);

module.exports = { commentsRouter, articleIdCommentRouter };
