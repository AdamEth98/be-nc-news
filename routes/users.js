const { getUsers, getUserByUsername } = require("../controllers/get");
const router = require("express").Router();

router.get("/:username", getUserByUsername);
router.get("/", getUsers);

module.exports = router;
