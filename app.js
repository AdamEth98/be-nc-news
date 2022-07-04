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
// custom errors
app.use((err, req, res, next) => {
  // if we provide a custom error, process and respond
  switch (err.status) {
    case 404:
      res.status(404).send({ status: 404, msg: err.msg });
  }
  // otherwise, continue
  next(err);
});

// PSQL errors
app.use((err, req, res, next) => {
  // provide a different response based on the err code given by PSQL
  switch (err.code) {
    case "22P02":
      res.status(400).send({ status: 400, msg: "400: article_id must be a number" });
  }
  // otherwise, continue
  next();
});

// server errors
app.use((err, req, res, next) => {
  console.log("Error: 500 internal server error");
  res.status(500).send({ status: 500, msg: "Error 500: internal server" });
});

module.exports = app;
