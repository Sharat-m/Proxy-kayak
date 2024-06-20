const express = require("express");
const autoRouter = express.Router();
const axios = require ('axios');

autoRouter.post("/mvm/smartyv2/search", async (req, res) => {
  try {
    const { where } = req.query;

    if (!where) {
      return res.status(400).json({
        error: "Where is missing to search the place",
      });
    }

    //Calling direct kayak Place Search API
    const targetUrl = `https://www.kayak.com/mvm/smartyv2/search?where=${encodeURIComponent(
      where
    )}`;
    const response = await axios.get(targetUrl);
    res.json(response.data);

    // calling the static responses for Place Search API
    // const autoJson = require("../data/places.json");
    // let results = autoJson
    //   .filter((place) =>
    //     where
    //       ? place.smartyDisplay.toLowerCase().includes(where.toLowerCase())
    //       : true
    //   )
    //   .slice(0, 6);
    // res.json({ results });
  } catch (error) {
    // console.log("error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = autoRouter;
