const db = require("../db/connection");

exports.updateArticle = (id, body) => {
  const query = `
                  UPDATE articles
                  SET
                    votes = votes + $1
                  WHERE article_id = $2
                  RETURNING *
                `;
  return db
    .query(query, [body.inc_votes, id])
    .then(({ rows }) => {
      if (rows[0]) return rows[0];

      // return a custom 404 error if nothing is returned from the query
      return Promise.reject({ status: 404, msg: `404: no article found with article_id ${id}` });
    })
    .catch((err) => {
      // append custom error message to the PSQL error
      const len = Object.keys(body).length;
      if (!len) {
        err.msg = "400: must provide a body in the patch request - {inc_votes: [number]}";
      } else if (isNaN(body.inc_votes + 1) && err.code === "22P02") {
        err.msg = "400: inc_votes must be of type number";
      } else if (isNaN(id + 1)) {
        err.msg = "400: article_id must be a number";
      }
      return Promise.reject(err);
    });
};
