const express = require("express");

const router = express.Router();

const hotelUrlRouter = require("../api/hotelUrl.js");
const autoRouter = require("../api/autosuggest");
const dateLessHotelRouter = require("../api/hotelDateLess.js");
const filterRouter = require("../api/hotelFilter.js");
const carUrlRouter = require("../api/carUrl.js");
const dateLessCarRouter = require("../api/carDateless.js");

router.use("/", hotelUrlRouter);
router.use("/", autoRouter);
router.use("/", dateLessHotelRouter);
router.use("/", filterRouter);
router.use("/", dateLessCarRouter);
router.use("/", carUrlRouter);

module.exports = router;
