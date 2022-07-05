const { updateArticle } = require("../models/patch");

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
