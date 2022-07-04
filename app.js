const express = require("express");
const { getTopics } = require("./controllers/get");

const app = express();
app.use(express.json());

// GET ROUTES
app.get("/api/topics", getTopics);

module.exports = app;
