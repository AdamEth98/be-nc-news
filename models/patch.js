const db = require("../db/connection");

exports.updateArticle = (id, increment) => {
  const query = `
                  UPDATE articles
                  SET
                    votes = votes + $1
                  WHERE article_id = $2
                  RETURNING *
                `;
  return db.query(query, [increment, id]).then(({ rows }) => {
    return rows[0];
  });
};
