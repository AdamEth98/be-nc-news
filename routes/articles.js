const { getArticlesById, getCommentsByArticleId, getArticles } = require("../controllers/get");
const { patchArticle } = require("../controllers/patch");
const { postComment } = require("../controllers/post");

const router = require("express").Router();

// GET
router
  .get("/:article_id", getArticlesById)
  .get("/:article_id/comments", getCommentsByArticleId)
  .get("/", getArticles)

  // PATCH
  .patch("/:article_id", patchArticle)

  // POST
  .post("/:article_id/comments", postComment);

module.exports = router;
