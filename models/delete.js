const db = require("../db/connection");

exports.removeComment = (id) => {
  const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`;

  return db
    .query(query, [id])
    .then(({ rows }) => {
      if (rows[0]) return rows;
      return Promise.reject({ status: 404, msg: `404: no comment found with id ${id}` });
    })
    .catch((err) => {
      if (err.code) err.msg = "400: comment_id must be a number";
      return Promise.reject(err);
    });
};
