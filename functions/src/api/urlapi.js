const express = require("express");
const getRouter = express.Router();

getRouter.get("/in", (req, res) => {
  const { a: affiliateid, url } = req.query;

  function extractParameters(url) {
    //regex to handle the guests and rooms
    const regex =
      /\/hotels\/([^\/]+)\/(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})(?:\/(\d+)adults)?(?:\/(\d+)children)?(?:\/(\d+)rooms)?(?:;[^?]+)?(?:\?.+)?/;
    const match = url.match(regex);
    if (!match) throw new Error("URL is Not Proper");

    const [
      ,
      destination,
      checkIn,
      checkOut,
      adults = "1",
      children = "0",
      rooms = "1",
    ] = match;
    return {
      destination,
      checkIn,
      checkOut,
      guests: { adults, children, rooms },
    };
  }

  function validateParameters({
    checkIn,
    checkOut,
    guests: { adults, children, rooms },
  }) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Function to check if the date is in the past
    let isPastDate = (checkIn) =>
      new Date(checkIn) < new Date().setHours(0, 0, 0, 0);
    //validating the checkin date and checkout date
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      throw new Error("Invalid date format");
    } else if (checkInDate >= checkOutDate) {
      throw new Error("Check-in date must be before check-out date");
    } else if (isPastDate(checkIn)) {
      throw new Error("Check-in date cannot be in the past");
    }

    adults = Number(adults);
    children = Number(children);
    rooms = Number(rooms);

    if (adults < 1) {
      throw new Error("There must be at least 1 adult");
    }

    if (adults > 4 * rooms) {
      throw new Error("Too many adults for the number of rooms");
    }

    if (children > adults) {
      throw new Error("Number of children cannot exceed number of adults");
    }

    if (rooms < 1) {
      throw new Error("There must be at least 1 room");
    }

    if (rooms > 8) {
      throw new Error("Too many rooms; maximum is 8");
    }

    if (adults + children > 4 * rooms) {
      throw new Error(
        "Total number of guests (adults + children) exceeds the limit per room"
      );
    }
  }

  try {
    const params = extractParameters(url);
    validateParameters(params);
    // Return success response
    // res.json({ message: "Parameters are valid!", params });
    // const redirectUrl = `https://www.farefirst.com/about`;
    const redirectUrl = `https://search.farefirst.com/hotels?=1&adults=2&checkIn=2024-09-05&checkOut=2024-09-06&children=&cityId=25772&currency=inr&destination=Mangalore&language=en&marker=83436.Zza63706ae2d904772b505cb28-83436`;

    res.redirect(redirectUrl);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = getRouter;
