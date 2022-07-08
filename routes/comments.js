const { deleteComment } = require("../controllers/delete");
const { patchComment } = require("../controllers/patch");
const router = require("express").Router();

// DELETE
router.delete("/:comment_id", deleteComment);
// PATCH
router.patch("/:comment_id", patchComment);

module.exports = router;
