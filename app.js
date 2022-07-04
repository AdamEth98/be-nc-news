const express = require("express");
const { getTopics, getArticlesById } = require("./controllers/get");

const app = express();
app.use(express.json());

// GET ROUTES
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);

// 404
app.get("/*", (req, res) => {
  res.status(404).send({ status: 404, msg: `Error: endpoint (${req.path}) not found.` });
});

// error handling
// PSQL errors
app.use((err, req, res, next) => {
  if (err.code) {
    console.log(err.code);
    res.send(400).send({ status: 400, msg: err.code });
  } else {
    next();
  }
});

// server errors
app.use((err, req, res, next) => {
  console.log("Error: 500 internal server error");
  res.status(500).send({ status: 500, msg: "Error 500: internal server" });
});

module.exports = app;
