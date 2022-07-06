const db = require("../db/connection");

exports.insertComment = (id, body, username) => {
  const query = `
                  INSERT INTO comments
                    (article_id, body, author)
                  VALUES
                    ($1, $2, $3)
                  RETURNING *;
                `;
  return db.query(query, [id, body, username]).then(({ rows }) => {
    return rows[0];
  });
};
