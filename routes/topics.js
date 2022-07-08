const { getTopics } = require("../controllers/get");
const router = require("express").Router();

// DELETE
router.get("/", getTopics);

module.exports = router;
