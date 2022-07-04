const db = require("../db/connection");

// should return all topics as an array
exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticlesById = (id) => {
  const query = `
                  SELECT users.name AS author, title, article_id, 
                    body, topic, created_at, votes
                  FROM articles
                  JOIN users 
                    ON users.username = articles.author
                  WHERE article_id = $1
                `;

  return db.query(query, [id]).then(({ rows }) => {
    return rows;
  });
};
