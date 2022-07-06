const db = require("../db/connection");
const { checkArticleExists } = require("../utils/query-helpers");

exports.insertComment = (id, body, username) => {
  return checkArticleExists(id)
    .then((result) => {
      // if no article, reject
      if (!result) return Promise.reject({ status: 404, msg: `404: no article with article_id ${id}` });
      // if body is empty, reject
      if (!body || !username || typeof body !== "string" || typeof username !== "string")
        return Promise.reject({ status: 400, msg: "400: request body must be {username: [string], body: [string]}" });

      const query = `
                    INSERT INTO comments
                      (article_id, body, author)
                    VALUES
                      ($1, $2, $3)
                    RETURNING *;
                  `;
      return db.query(query, [id, body, username]);
    })
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
