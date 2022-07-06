const db = require("../db/connection");

exports.checkArticleExists = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rowCount }) => {
      return rowCount ? true : false;
    })
    .catch((err) => {
      if (isNaN(id + 1)) return Promise.reject({ status: 400, msg: "400: article_id must be a number" });
      return Promise.reject(err);
    });
};
