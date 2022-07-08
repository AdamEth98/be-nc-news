const { updateArticle, updateComment } = require("../models/patch");

// update the votes property of a row based on the article_id
exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;

  updateArticle(article_id, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateComment(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
