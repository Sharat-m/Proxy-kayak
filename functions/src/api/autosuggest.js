const express = require("express");
const autoRouter = express.Router();
const axios = require("axios");

autoRouter.post("/search", async (req, res) => {
  try {
    const { where } = req.query;
    // console.log(where);

    const targetUrl = `https://www.kayak.com/mvm/smartyv2/search?where=${encodeURIComponent(
      where
    )}`;
    // const autoJson = require("../data/places.json");
    // console.log("Filtered results:", autoJson);

    const response = await axios.get(targetUrl);
    // res.json({ places: autoJson });
    res.json(response.data);
  } catch (error) {
    console.log("error:", error);

    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = autoRouter;
