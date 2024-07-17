const express = require("express");

const router = express.Router();

const autoRouter = require("../api/autosuggest.js");
const hotelUrlRouter = require("../api/hotelUrl.js");
const dateLessHotelRouter = require("../api/hotelDateLess.js");
const carUrlRouter = require("../api/carUrl.js");
const dateLessCarRouter = require("../api/carDateless.js");

router.use("/", autoRouter);
router.use("/", hotelUrlRouter);
router.use("/", dateLessHotelRouter);
router.use("/", carUrlRouter);
router.use("/", dateLessCarRouter);

module.exports = router;
