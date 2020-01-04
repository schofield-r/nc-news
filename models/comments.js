const connection = require("../db/connection");

exports.patchCommentById = (comment_id, vote = 0) => {
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", comment_id)
    .increment({ votes: vote })
    .returning("*")
    .then(comment => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment id does not exist"
        });
      } else return comment;
    });
};
exports.deleteComment = comment_id => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(rowsDeleted => {
      if (rowsDeleted === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment id does not exist"
        });
      }
    });
};
