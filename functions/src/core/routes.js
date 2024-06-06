const express = require("express");

const router = express.Router();

const getRouter = require("../api/urlapi");
const autoRouter = require("../api/autosuggest");
const dateLessRouter = require("../api/dateLess");
const filterRouter = require("../api/filterApi");

router.use("/", getRouter);
router.use("/", autoRouter);
router.use("/", dateLessRouter);
router.use("/", filterRouter);

module.exports = router;
