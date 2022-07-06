const db = require("../db/connection");

exports.removeComment = (id) => {
  const query = `DELETE FROM comments WHERE comment_id = $1`;

  return db
    .query(query, [id])
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      err.msg = "400: comment_id must be a number";
      return Promise.reject(err);
    });
};
