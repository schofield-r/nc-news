const connection = require("../db/connection");
const { checkRowExists } = require("./utils");

exports.fetchArticles = query => {
  const author = query.author;
  const topic = query.topic;
  return connection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes","articles.body"
    )
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(query.sort_by || "created_at", query.order || "desc")
    .modify(query => {
      if (author) query.where("articles.author","=",author);
      else if (topic) query.where("articles.topic","=",topic);
    })
    .returning("*")
    .then(articles => {
      if (!articles.length) {
        if (author) {
          return checkRowExists("users", "username", author);
        } else if (topic) {
          return checkRowExists("topics", "slug", topic);
        }
      } else {
        return articles;
      }
    });
};

exports.fetchArticleById = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", article_id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count({ comment_count: "comment_id" })
    .groupBy("articles.article_id")
    .returning("*")
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "article not found" });
      } else return article[0];
    });
};
exports.patchArticle = (article_id, votes = 0) => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .increment({ votes: votes })
    .returning("*")
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "article does not exists" });
      } else return article[0];
    });
};
exports.postComment = (article_id, comment) => {
  return connection("comments")
    .where("article_id", article_id)
    .insert({
      body: comment.body,
      author: comment.username,
      article_id: article_id
    })
    .returning("*");
};
exports.fetchComments = (article_id, query) => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(query.sort_by || "created_at", query.order || "desc")
    .returning("*")
    .then(comments => {
      if (!comments.length) {
        return checkRowExists("articles", "article_id", article_id);
      } else {
        return comments;
      }
    });
};
exports.createArticle = article => {
  return connection("articles")
    .insert({
      title: article.title,
      topic: article.topic,
      author: article.author,
      body: article.body
    })
    .returning("*");
};
exports.deleteArticle = article_id => {
  return connection("articles")
    .where("article_id", article_id)
    .del()
    .then(rowsDeleted => {
      if (rowsDeleted === 0) {
        return Promise.reject({
          status: 404,
          msg: "article id does not exist"
        });
      }
    });
};
