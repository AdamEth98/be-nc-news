const express = require("express");
const { customErrors, psqlErrors, serverErrors } = require("./error-handling");
const { articleRouter, commentRouter, topicRouter, userRouter, globalRouter } = require("./routes/index");

const app = express();
app.use(express.json());

// routers
app.use("/api/articles", articleRouter);
app.use("/api/comments", commentRouter);
app.use("/api/topics", topicRouter);
app.use("/api/users", userRouter);
app.use("/", globalRouter);

// error handling
// custom errors
app.use(customErrors);
// PSQL errors
app.use(psqlErrors);
// server errors
app.use(serverErrors);

module.exports = app;
