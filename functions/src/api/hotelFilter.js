// const express = require("express");
// const filterRouter = express.Router();

// //regex to handle the guests and rooms
// const urlPattern = /^\/hotels\/([^\/]+),([^\/]+)\/(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})(?:\/(\d+)adults)?(?:\/(\d+)children)?(?:\/(\d+)rooms)?(?:;[^?]+)?(?:\?.+)?(\?fs=.*)?$/;

// const validPropertyTypes = [
//   "apthotel", "bb", "capsulehotel", "guesthouse", "hostel", 
//   "hotel", "inn", "motel", "pension", "rental", 
//   "resort", "riad", "ryokan"
// ];

// filterRouter.get('/filter-in', (req, res) => {
//   const { a: affiliateid, enc_pid, url } = req.query;
// // let original_url =req.originalUrl;
//   // console.log(original_url);

//   //Checking the affiliate ID is present or not in the URL
//   if (!affiliateid || affiliateid !== "farefirst123") {
//     return res.status(400).json({
//       error: "Affiliated id is missing or not proper",
//     });
//   }

//    // Checking the enc pid is present or not in the url
//    if (!enc_pid || enc_pid !== "deeplinks") {
//     return res.status(400).json({
//       error: "Production id is missing or not proper",
//     });
//   }

//    // checking the url is present or not
//    if (!url) {
//     return res.status(400).json({
//       error: "Url is missing",
//     });
//   }

//   //checking the url formate is matching or not
//   const match = url.match(urlPattern);
//   //chek the url is valid or not
//   if (!match) {
//     return res.status(400).json({ error: "Invalid URL format" });
//   }

//   let [
//     ,
//     cityDetails,
//     countryState,
//     checkIn,
//     checkOut,
//     adults = "1",
//     children = "0",
//     rooms = "1",
//   ] = match;

//   const checkInDate = new Date(checkIn);
//   const checkOutDate = new Date(checkOut);

//   // Function to check if the date is in the past
//   function validateParameters(checkInDate, checkOutDate, adults, children, rooms) {
//     let isPastDate = (checkIn) =>
//       new Date(checkIn) < new Date().setHours(0, 0, 0, 0);
//     // let isPastDate = (date) => new Date(date) < new Date().setHours(0, 0, 0, 0);
//     //validating the checkin date and checkout date
//     if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
//       return { error: true, message: "Invalid date format" };
//     }
//     if (checkInDate >= checkOutDate) {
//       return {
//         error: true,
//         message: "Check-in date must be before check-out date",
//       };
//     }
//     if (isPastDate(checkIn)) {
//       return { error: true, message: "Check-in date cannot be in the past" };
//     }
//     adults = Number(adults);
//     children = Number(children);
//     rooms = Number(rooms);

//     if (rooms < 1) {
//       return { error: true, message: "There must be at least 1 room" };
//     }

//     if (adults < 1) {
//       return { error: true, message: "There must be at least 1 adult" };
//     }

//     // if (adults > 4 * rooms) {
//     //  return {error:true, message:"Too many adults for the number of rooms"}
//     // }

//     // if (children > adults) {
//     //  return {error:true, message:"Number of children cannot exceed number of adults"}
//     // }

//     if (rooms > 8) {
//       return { error: true, message: "The maximum room is 8" };
//     }
//     if (adults < rooms) {
//       return { error: true, message: "For 1 room 1 adult is required" };
//     }

//     const totalGuests = adults + children;
//     if (totalGuests > 4 * rooms) {
//       return {
//         error: true,
//         message:
//           "Total number of guests (adults + children) exceeds the limit per room",
//       };
//     }
//     return { errror: false };
//   }

//   let validationResponse = validateParameters(checkInDate, checkOutDate, adults, children, rooms);
//   if (validationResponse.error) {
//     return res.status(400).json({
//       code: 400,
//       message: validationResponse.message,
//       details: [],
//     });
//   }


//   const queryParams = req.query.fs;

//   // Parse query parameters if they exist
//   let amenities, freebies, ambiance, propertyType;
//   if (queryParams) {
//     const params = queryParams.split(';');
//     params.forEach(param => {
//       const [key, value] = param.split('=');
//       if (key === 'amenities') amenities = value;
//       if (key === 'freebies') freebies = value;
//       if (key === 'ambiance') ambiance = value;
//       if (key === 'property-type') propertyType = value;
//     });
//   }

//   // Validate filter parameters
//   if (queryParams) {
//     if (propertyType) {
//       // Split the property types by ',' and validate each type
//       const propertyTypes = propertyType.split(',');
//       for (let type of propertyTypes) {
//         const individualTypes = type.split(':');
//         for (let individualType of individualTypes) {
//           if (!validPropertyTypes.includes(individualType)) {
//             return res.status(400).json({
//               error: "Invalid property type",
//             });
//           }
//         }
//       }
//     }

//     if (!amenities && !freebies && !ambiance && !propertyType) {
//       return res.status(400).json({
//         error: "Invalid filter parameters",
//       });
//     }
//   }

//   // if(queryParams && (!ambiance || !freebies || !amenities || !validPropertyTypes.includes(propertyType))){
//   //   return res.status(400).json({
//   //     error: "Invalid filter parameters",
//   //   });
//   // }

//   try {
//     // Return success response
//     res.json({
//       original_url,
//       cityDetails,
//       countryState,
//       checkIn,
//       checkOut,
//       adults,
//       children,
//       rooms,
//       amenities,
//       freebies,
//       ambiance,
//       propertyType,
//       message: "Filter API is successfully redirected to the kayak web page",
//   });
//   } catch (error) {
//     res.status(500).send({ status: "Failed", message: "Internal Server Error" });
//   }
// });
// module.exports = filterRouter;

const express = require("express");
const filterRouter = express.Router();

// Regex to handle the guests and rooms
const urlPattern = /^\/hotels\/([^\/]+),([^\/]+)\/(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})(?:\/(\d+)adults)?(?:\/(\d+)children)?(?:\/(\d+)rooms)?(?:;[^?]+)?(?:\?.+)?(\?fs=.*)?$/;

const validPropertyTypes = [
  "apthotel", "bb", "capsulehotel", "guesthouse", "hostel", 
  "hotel", "inn", "motel", "pension", "rental", 
  "resort", "riad", "ryokan"
];

filterRouter.get('/filter-in', (req, res) => {
  const { a: affiliateid, enc_pid, url } = req.query;
  let original_url =req.originalUrl;

  // Checking the affiliate ID
  if (!affiliateid || affiliateid !== "farefirst123") {
    return res.status(400).json({
      error: "Affiliate id is missing or not proper",
    });
  }

  // Checking the enc_pid
  if (!enc_pid || enc_pid !== "deeplinks") {
    return res.status(400).json({
      error: "Production id is missing or not proper",
    });
  }

  // Checking the URL
  if (!url) {
    return res.status(400).json({
      error: "URL is missing",
    });
  }

  // Checking the URL format
  const match = url.match(urlPattern);
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

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Function to validate parameters
  function validateParameters(checkInDate, checkOutDate, adults, children, rooms) {
    let isPastDate = (date) => new Date(date) < new Date().setHours(0, 0, 0, 0);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return { error: true, message: "Invalid date format" };
    }
    if (checkInDate >= checkOutDate) {
      return {
        error: true,
        message: "Check-in date must be before check-out date",
      };
    }
    if (isPastDate(checkInDate)) {
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
    if (rooms > 8) {
      return { error: true, message: "The maximum number of rooms is 8" };
    }
    if (adults < rooms) {
      return { error: true, message: "Each room requires at least 1 adult" };
    }

    const totalGuests = adults + children;
    if (totalGuests > 4 * rooms) {
      return {
        error: true,
        message: "Total number of guests (adults + children) exceeds the limit per room",
      };
    }

    return { error: false };
  }

  const validationResponse = validateParameters(checkInDate, checkOutDate, adults, children, rooms);
  if (validationResponse.error) {
    return res.status(400).json({
      code: 400,
      message: validationResponse.message,
      details: [],
    });
  }

  const queryParams = req.query.fs;

  // Parse query parameters if they exist
  let amenities, freebies, ambiance, propertyType;
  if (queryParams) {
    const params = queryParams.split(';');
    params.forEach(param => {
      const [key, value] = param.split('=');
      if (key === 'amenities') amenities = value;
      if (key === 'freebies') freebies = value;
      if (key === 'ambiance') ambiance = value;
      if (key === 'property-type') propertyType = value;
    });
  }

  // Validate filter parameters
  if (queryParams) {
    if (propertyType) {
      // Split the property types by ',' and validate each type
      const propertyTypes = propertyType.split(',');
      for (let type of propertyTypes) {
        const individualTypes = type.split(':');
        for (let individualType of individualTypes) {
          if (!validPropertyTypes.includes(individualType)) {
            return res.status(400).json({
              error: "Invalid property type",
            });
          }
        }
      }
    }

    if (!amenities && !freebies && !ambiance && !propertyType) {
      return res.status(400).json({
        error: "Invalid filter parameters",
      });
    }
  }

  try {
    // Return success response
    res.json({
      original_url,
      cityDetails,
      countryState,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      amenities,
      freebies,
      ambiance,
      propertyType,
      message: "Filter API is successfully redirected to the kayak web page",
    });
  } catch (error) {
    res.status(500).send({ status: "Failed", message: "Internal Server Error" });
  }
});

module.exports = filterRouter;

