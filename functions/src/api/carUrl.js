const express = require("express");
const carUrlRouter = express.Router();

// https://www.kayak.com/cars/Mangalore,Karnataka,India-c27179/Bengaluru,Karnataka,India-c14559/2024-07-24-14h/2024-07-26-15h?sort=rank_a
const regex =
  /^\/cars\/([^\/]+)\/(?:([^\/]+)\/)?(\d{4}-\d{2}-\d{2}(?:-\d{2}h)?)\/(\d{4}-\d{2}-\d{2}(?:-\d{2}h)?)\/?$/;

carUrlRouter.get("/cars", (req, res) => {
  const { a: affiliateid, enc_pid, url } = req.query;
  let original_url = req.originalUrl;

  //checking the affiliate ID is present or not in the URL
  if (!affiliateid || affiliateid !== "farefirst123") {
    return res.status(400).json({
      error: "Affiliated id is missing or not proper",
    });
  }

  // checking the enc pid is present or not in the url
  if (!enc_pid || enc_pid !== "deeplinks") {
    return res.status(400).json({
      error: "Production id is missing or not proper",
    });
  }

  // checking the url is present or not
  if (!url) {
    return res.status(400).json({
      error: "Url is missing",
    });
  }

  //checking the url formate is matching or not
  const match = url.match(regex);
  //check the url is valid or not
  if (!match) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  let [, pickUpLocation, dropLocation, pickUpDateHour, dropOffDateHour] = match;
  //   return {
  //     cityDetails,
  //     countryState,
  //     pickUpDate,
  //     dropOffDate,
  //     guests: { adults, children, rooms },
  //   };
  // }
  // console.log("pickUpLocation:",pickUpLocation);
  // console.log("dropLocation:", dropLocation);
  // console.log("pickUpDateHour:", pickUpDateHour);
  // console.log("dropOffDateHour:", dropOffDateHour);

  function parseDateWithOptionalTime(dateStr) {
    if (dateStr.includes("-") && dateStr.includes("h")) {
      const [date, time] = dateStr.split("-");
      return new Date(`${date}T${time.replace("h", "")}:00:00`);
    } else {
    return new Date(dateStr);
  }
}

  const pickUpDate = parseDateWithOptionalTime(pickUpDateHour);
  console.log("pickUpDate:", pickUpDate);
  const dropOffDate = parseDateWithOptionalTime(dropOffDateHour);
  console.log("dropOffDate:", dropOffDate);
  // const pickUpDate = new Date(pickUpdate);
  // const dropOffDate = new Date(dropOffdate);

  // Function to check if the date is in the past
  function isPastDate(date) {
    // return new Date(date) < new Date().setHours(0, 0, 0, 0);
    console.log(date );
    console.log(new Date());
    console.log(date < new Date());
    const today = new Date();
    // today.setHours(0, 0, 0, 0);
    console.log("Today's date:", today);
    return date < today;
  }

  // Function is used to check if the date is in the past
  function validateParameters(pickUpDate, dropOffDate) {
    //validating the pickUpDate date and dropOffDate date
    if (isNaN(pickUpDate.getTime()) || isNaN(dropOffDate.getTime())) {
      return { error: true, message: "Invalid date format" };
    }

    if (isPastDate(pickUpDate)) {
      return { error: true, message: "The pick-up date can't be in the past." };
    }

    if (dropOffDate < pickUpDate) {
      return {
        error: true,
        message: "The drop-off date can't be before the pick-up date.",
      };
    }

    return { error: false, message: "" };
  }

  let validationResponse = validateParameters(pickUpDate, dropOffDate);
  if (validationResponse.error) {
    return res.status(400).json({
      code: 400,
      message: validationResponse.message,
      details: [],
    });
  }

  try {
    // Return success response
    res.json({
      pickUpLocation,
      dropLocation,
      pickUpDateHour,
      dropOffDateHour,
      message: "Car Web Url is Successfully redirected to the kayak web page",
    });
    // res.json({
    //  original_url
    // });
    // const redirectUrl = `https://www.farefirst.com/about`;
    // const redirectUrl = `https://search.farefirst.com/hotels?=1&adults=2&pickUpDate=2024-09-05&dropOffDate=2024-09-06&children=&cityId=25772&currency=inr&destination=Mangalore&language=en&marker=83436.Zza63706ae2d904772b505cb28-83436`;
    // res.redirect(redirectUrl);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Failed", message: "Internal Server Error" });
  }
});
module.exports = carUrlRouter;
