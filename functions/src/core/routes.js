const express = require("express");

const router = express.Router();

const getRouter = require("../api/urlapi");
const autoRouter = require("../api/autosuggest");
const dateLessRouter = require("../api/dateLess");

router.use("/", getRouter);
router.use("/", autoRouter);
router.use("/", dateLessRouter);

module.exports = router;
