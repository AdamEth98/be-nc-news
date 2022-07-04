const express = require("express");
const { getTopics } = require("./controllers/get");

const app = express();
app.use(express.json());

// GET ROUTES
app.get("/api/topics", getTopics);

// 404
app.get("/*", (req, res) => {
  res.status(404).send({ status: 404, msg: `Error: endpoint (${req.path}) not found.` });
});

module.exports = app;
