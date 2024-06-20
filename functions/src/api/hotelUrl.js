const express = require("express");
const hotelUrlRouter = express.Router();

//regex to handle the guests and rooms
//url=/hotels/{City_Details},{Country/State}/{Check-In_Date}/{Check-Out_Date}/{Number_ Adults}/{Number_children}/{Number_rooms}
const regex =
  /^\/hotels\/([^\/]+),([^\/]+)\/(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})(?:\/(\d+)adults)?(?:\/(\d+)children)?(?:\/(\d+)rooms)?(?:;[^?]+)?(?:\?.+)?/;

hotelUrlRouter.get("/in", (req, res) => {
  const { a: affiliateid, enc_pid, url } = req.query;
  // let original_url =req.originalUrl;
  // console.log(original_url);

  //Checking the affiliate ID is present or not in the URL
  if (!affiliateid || affiliateid !== "farefirst123") {
    return res.status(400).json({
      error: "Affiliated id is missing or not proper",
    });
  }

  // Checking the enc pid is present or not in the url
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
  //chek the url is valid or not
  if (!match) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  let [
    ,
    cityDetails,
    countryState,
    checkIn,
    checkOut,
    adults = "1",
    children = "0",
    rooms = "1",
  ] = match;
  //   return {
  //     cityDetails,
  //     countryState,
  //     checkIn,
  //     checkOut,
  //     guests: { adults, children, rooms },
  //   };
  // }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Function is used to check if the date is in the past
  function validateParameters(checkInDate, checkOutDate) {
    let isPastDate = (checkIn) =>
      new Date(checkIn) < new Date().setHours(0, 0, 0, 0);
    //validating the checkin date and checkout date
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return { error: true, message: "Invalid date format" };
    }
    if (checkInDate >= checkOutDate) {
      return {
        error: true,
        message: "Check-in date must be before check-out date",
      };
    }
    if (isPastDate(checkIn)) {
      return { error: true, message: "Check-in date cannot be in the past" };
    }
    adults = Number(adults);
    children = Number(children);
    rooms = Number(rooms);

    if (rooms < 1) {
      return { error: true, message: "There must be at least 1 room" };
    }

    if (adults < 1) {
      return { error: true, message: "There must be at least 1 adult" };
    }

    // if (adults > 4 * rooms) {
    //  return {error:true, message:"Too many adults for the number of rooms"}
    // }

    // if (children > adults) {
    //  return {error:true, message:"Number of children cannot exceed number of adults"}
    // }

    if (rooms > 8) {
      return { error: true, message: "The maximum room is 8" };
    }
    if (adults < rooms) {
      return { error: true, message: "For 1 room 1 adult is required" };
    }

    const totalGuests = adults + children;
    if (totalGuests > 4 * rooms) {
      return {
        error: true,
        message:
          "Total number of guests (adults + children) exceeds the limit per room",
      };
    }
    return { errror: false };
  }

  let validationResponse = validateParameters(checkInDate, checkOutDate);
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
      cityDetails,
      countryState,
      adults: adults,
      children: children,
      rooms: rooms,
      message: "Web Url is Successfully redirected to the kayak web page",
    });
    // const redirectUrl = `https://www.farefirst.com/about`;
    // const redirectUrl = `https://search.farefirst.com/hotels?=1&adults=2&checkIn=2024-09-05&checkOut=2024-09-06&children=&cityId=25772&currency=inr&destination=Mangalore&language=en&marker=83436.Zza63706ae2d904772b505cb28-83436`;
    // res.redirect(redirectUrl);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Failed", message: "Internal Server Error" });
  }
});
module.exports = hotelUrlRouter;
