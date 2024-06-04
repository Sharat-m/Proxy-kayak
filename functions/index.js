const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./src/core/routes");

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.use("/", routes);

const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.kayakproxy = onRequest(app);
