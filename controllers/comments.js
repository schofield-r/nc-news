const { patchCommentById, deleteComment } = require("../models/comments");

exports.changeCommentVoteById = (req, res, next) => {
  const { comment_id } = req.params;
  let vote = req.body.inc_votes;
  patchCommentById(comment_id, vote)
    .then(comment => {
      res.status(200).send({ comment: comment[0] });
    })
    .catch(next);
};
exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send({ msg: `comment ${comment_id} deleted` });
    })
    .catch(next);
};
