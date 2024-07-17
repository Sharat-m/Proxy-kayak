const express = require("express");
const dateLessCarRouter = express.Router();

// checking the url by regex
//https://www.kayak.com/in?a={Affiliate_ID}&encoder=27_1&enc_pid=deeplinks&url=/cars-dateless/JFK
const urlPattern = /^\/car-dateless\/([^\/]+)/;

// Routes
dateLessCarRouter.get("/carin", (req, res) => {
  const { a: affiliateid, enc_pid, url } = req.query;
  let original_url =req.originalUrl;
  // console.log(original_url);

  if (!affiliateid || affiliateid !== "farefirst123")
    return res.status(400).json({
      error: "Affiliated id is missing or not proper",
    });

  if (!enc_pid || enc_pid !== "deeplinks") {
    return res.status(400).json({
      error: "enc_pid not present in the url",
    });
  }

  if (!url) {
    return res.status(400).json({
      error: "Url is missing",
    });
  }

  const match = url.match(urlPattern);
  //chek the url is valid or not
  if (!match) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  const [, cityID] = match;

  // validation
  try {
    res.json({
      // cityID,
      // message: "Dateless car results fetched successfully",
      original_url
    });
    // const redirect = `https://www.kayak.com/cars/Los-Angeles%2CCA/SFO/2024-12-02/2024-12-05/?sort=distance_a`
    // res.redirect(redirect);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
});
module.exports = dateLessCarRouter;
