const {
  fetchArticles,
  fetchArticleById,
  patchArticle,
  postComment,
  fetchComments,
  createArticle,
  deleteArticle,
  totalCount
} = require("../models/articles");

exports.sendArticles = (req, res, next) => {
  const query = req.query;
  Promise.all([fetchArticles(query), totalCount("articles", query)])
    .then(results => {
      res.status(200).send({ articles: results[0], total_count: results[1] });
    })
    .catch(next);
};
exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body.inc_votes;
  patchArticle(article_id, votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.postCommentOnArticle = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  postComment(article_id, comment)
    .then(comment => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch(next);
};
exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const query = req.query;
  Promise.all([fetchComments(article_id, query), totalCount("comments", query)])
    .then(results => {
      res.status(200).send({ comments: results[0], total_count: results[1] });
    })
    .catch(next);
};
exports.postArticle = (req, res, next) => {
  const article = req.body;
  createArticle(article)
    .then(article => {
      res.status(201).send({ article: article[0] });
    })
    .catch(next);
};
exports.deleteArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  deleteArticle(article_id)
    .then(() => {
      res.status(204).send({ msg: `article ${article_id} deleted` });
    })
    .catch(next);
};
