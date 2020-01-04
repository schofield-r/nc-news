const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection.select("*").from("topics");
};

exports.createTopic = topic => {
  return connection("topics")
    .insert({
      description: topic.description,
      slug: topic.slug
    })
    .returning("*");
};
