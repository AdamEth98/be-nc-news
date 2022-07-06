const { insertComment } = require("../models/post");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body, username } = req.body;
  insertComment(article_id, body, username).then((comment) => {
    res.status(201).send({ comment });
  });
};
