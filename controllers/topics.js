const { fetchTopics, createTopic } = require("../models/topics");

exports.sendTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
exports.postTopic = (req, res, next) => {
  const topic = req.body;
  createTopic(topic)
    .then(topic => {
      res.status(201).send({ topic: topic[0] });
    })
    .catch(next);
};
