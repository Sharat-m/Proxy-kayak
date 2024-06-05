const express = require("express");
const autoRouter = express.Router();
const axios = require("axios");

autoRouter.post("/search", async (req, res) => {
  try {
    const { where } = req.query;
    // console.log(where);
    const autoJson = require("../data/places.json");

let results = autoJson.filter((place) => where ? place.smartyDisplay.toLowerCase().includes(where.toLowerCase()) : true ).slice(0, 6)
// console.log(results);
res.json({results})
  } catch (error) {
    console.log("error:", error);

    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = autoRouter;
