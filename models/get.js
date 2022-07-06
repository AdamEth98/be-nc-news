const db = require("../db/connection");
const { checkArticleExists } = require("../utils/query-helpers");
const format = require("pg-format");

// should return all topics as an array
exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticlesById = (id) => {
  const query = `
                  SELECT users.name AS author, articles.title, articles.article_id, 
                    articles.body, articles.topic, articles.created_at, articles.votes,
                      COUNT(comments.article_id)::int AS comment_count
                  FROM articles
                  LEFT JOIN comments 
                    ON comments.article_id = articles.article_id
                  JOIN users 
                    ON users.username = articles.author
                  WHERE articles.article_id = $1
                  GROUP BY articles.article_id, users.name
                `;

  return db
    .query(query, [id])
    .then(({ rows }) => {
      if (rows[0]) return rows[0];
      return Promise.reject({ status: 404, msg: `404: no article found with article_id ${id}` });
    })
    .catch((err) => {
      // append custom error message to the PSQL error if article_id is not a number
      if (isNaN(id + 1) && err.code === "22P02") {
        err.msg = "400: article_id must be a number";
      }
      return Promise.reject(err);
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

exports.fetchCommentsByArticleId = (id) => {
  // pre check to see if ID exists, for custom errors
  return checkArticleExists(id)
    .then((result) => {
      if (!result) {
        return Promise.reject({ status: 404, msg: `404: no article found with article_id ${id}` });
      }
      // if so, continue and make the main query
      const query = `
                    SELECT comments.comment_id, comments.body, comments.votes, 
                    users.name AS author, comments.article_id, comments.created_at
                    FROM comments 
                    JOIN users
                    ON users.username = comments.author
                    WHERE article_id = $1
                  `;
      return db.query(query, [id]);
    })
    .then(({ rows }) => {
      if (rows.length !== 0) return rows;

      // if rows is empty, then no comments with this article_id
      return Promise.reject({ status: 404, msg: `404: no comments found for article_id ${id}` });
    })
    .catch((err) => {
      if (isNaN(id + 1) && err.code === "22P02") {
        err.msg = "400: article_id must be a number";
      }
      return Promise.reject(err);
    });
};

exports.fetchArticles = (sort = "created_at", order = "DESC", topic = "%") => {
  let query = format(
    `
                  SELECT users.name AS author, articles.title, articles.article_id, 
                    articles.topic, articles.created_at, articles.votes,
                      COUNT(comments.article_id)::int AS comment_count
                  FROM articles
                  LEFT JOIN comments 
                  ON comments.article_id = articles.article_id
                  JOIN users 
                  ON users.username = articles.author
                  WHERE articles.topic LIKE %3$L
                  GROUP BY articles.article_id, users.name
                  ORDER BY articles.%1$I %2$s
                `,
    sort,
    order,
    topic
  );

  return db
    .query(query)
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      if (err.code === "42703") err.msg = "400: invalid sort_by query";
      if (err.code === "42601") err.msg = "400: invalid order query";
      return Promise.reject(err);
    });
};
