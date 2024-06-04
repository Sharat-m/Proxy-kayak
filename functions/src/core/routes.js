const express = require("express");

const router = express.Router();

const getRouter = require("../api/urlapi");
const autoRouter = require("../api/autosuggest");

router.use("/", getRouter);
router.use("/", autoRouter);

module.exports = router;
