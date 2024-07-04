const express = require("express");
const autoRouter = express.Router();
const axios = require("axios");


// https://www.kayak.com/mvm/smartyv2/search?f=j&s=car&where=Mangalore%2C%20Karnataka%2C%20India&lc_cc=US&lc=en
autoRouter.post("/mvm/smartyv2/search", async (req, res) => {
  try {
    const { f, s , where, lc_cc , lc } = req.query;
    if (!where) {
      return res.status(400).json({
        error: "Where is missing to search the place",
      });
    }

    // Validate 'f' and 's'
    if (!f) {
      return res.status(400).json({
        error: "'f' parameter is required",
      });
    }

    if (!s) {
      return res.status(400).json({
        error: "'s' parameter is required",
      });
    }

    if(!lc_cc){
      return res.status(400).json({
        error: "'lc_cc' parameter is required",
      })
    }

    
    if(!lc){
      return res.status(400).json({
        error: "'lc' parameter is required",
      })
    }

    let targetUrl;
    if (s === "50" || s == "car") {
      targetUrl = `https://www.kayak.com/mvm/smartyv2/search?f=${encodeURIComponent(f)}&s=${encodeURIComponent(s)}&where=${encodeURIComponent(where)}&lc_cc=${encodeURIComponent(lc_cc)}&lc=${encodeURIComponent(lc)}`;
    }else {
      return res.status(400).json({
        error: "Invalid 's' parameter value",
      });
    }

    const response = await axios.get(targetUrl);
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.message || error);

    // if (error.response) {
    //   return res.status(error.response.status).json({
    //     error: error.response.data,
    //   });
    // } else if (error.request) {
    //   return res.status(502).json({ error: "No response from the target API" });
    // } else {
    //   return res.status(500).json({ error: "Internal server error" });
    // }
  }
});

module.exports = autoRouter;
