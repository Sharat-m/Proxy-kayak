const express = require("express");
const dateLessRouter = express.Router();

// checking the url by regex
const urlPattern =
  /^\/hotels-dateless\/([^\/]+),([^\/]+)(\/(\d+)adults(\/(\d+)children(\/(\d+)rooms)?)?)?$/;

// Routes
dateLessRouter.get(
  "/hotels-dateless/:cityDetails,:countryState*",
  (req, res) => {
    const url = req.originalUrl;
    const match = url.match(urlPattern);

    //chek the url is valid or not
    if (!match) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const [
      ,
      cityDetails,
      countryState,
      ,
      adults = "1",
      ,
      children = "0",
      ,
      rooms = "1",
    ] = match;
    const adultsNum = Number(adults);
    const childrenNum = Number(children);
    const roomsNum = Number(rooms);

    // validation
    function validateAdults(adultsNum, childrenNum, roomsNum) {
      if (adultsNum < 1) {
        return { error: true, message: "There must be at least 1 adult" };
      }
      if (childrenNum > adultsNum) {
        return {
          error: true,
          message: "Number of children cannot exceed number of adults",
        };
      }
      if (roomsNum < 1) {
        return { error: true, message: "There must be at least 1 room" };
      }
      if (roomsNum > 8) {
        return { error: true, message: "Too many rooms; maximum is 8" };
      }

      if (adultsNum < roomsNum) {
        return { error: true, message: "For 1 room 1 adult is required" };
      }

      const totalGuests = adultsNum + childrenNum;
      if (totalGuests > 4 * roomsNum) {
        return {
          error: true,
          message: "Too many TotalGuests more than rooms",
        };
      }
      return { errror: false };
    }

    let validationResponse = validateAdults(adultsNum, childrenNum, roomsNum);
    if (validationResponse.error) {
      return res.status(400).json({
        code: 400,
        message: validationResponse.message,
        details: [],
      });
    }

    try {
      res.json({
        cityDetails,
        countryState,
        adults: adultsNum,
        children: childrenNum,
        rooms: roomsNum,
        message: "Dateless hotel results fetched successfully",
      });
      // const redirect = `https://search.farefirst.com/hotels?=1&adults=2&checkIn=2024-09-05&checkOut=2024-09-06&children=&cityId=25772&currency=inr&destination=Mangalore&language=en&marker=83436.Zza63706ae2d904772b505cb28-83436`
      // res.redirect(redirect);
    } catch (error) {
    //   console.log(error);
      res.status(500).send({
        status: "Failed",
        message: "Internal Server Error",
      });
    }
  }
);
module.exports = dateLessRouter;
