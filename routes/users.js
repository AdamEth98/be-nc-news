const { getUsers } = require("../controllers/get");
const router = require("express").Router();

router.get("/", getUsers);

module.exports = router;
