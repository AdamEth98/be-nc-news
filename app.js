const express = require("express");
const { getTopics, getArticlesById, getUsers, getCommentsByArticleId, getArticles } = require("./controllers/get");
const { patchArticle } = require("./controllers/patch");
const { customErrors, psqlErrors, serverErrors } = require("./error-handling");

const app = express();
app.use(express.json());

// GET ROUTES
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/articles", getArticles);

// PATCH ROUTES
app.patch("/api/articles/:article_id", patchArticle);

// 404
app.get("*", (req, res) => {
  res.status(404).send({ status: 404, msg: `Error: endpoint (${req.path}) not found.` });
});

// error handling
// custom errors
app.use(customErrors);
// PSQL errors
app.use(psqlErrors);
// server errors
app.use(serverErrors);

module.exports = app;
