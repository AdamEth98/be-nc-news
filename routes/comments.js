const { deleteComment } = require("../controllers/delete");
const router = require("express").Router();

// DELETE
router.delete("/:comment_id", deleteComment);

module.exports = router;
