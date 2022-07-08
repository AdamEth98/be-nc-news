const { getApi } = require("../controllers/get");

const router = require("express").Router();

router.get("/api", getApi);
router.get("*", (req, res) => {
  res.status(404).send({ status: 404, msg: `Error: endpoint (${req.path}) not found.` });
});

module.exports = router;
