const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

const errorMiddleware = require("./middleware/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route Imports
// //----------------------------------
// // This is Product routes
// //----------------------------------
const product = require("./routes/productRoute");
// //----------------------------------
// // This is user Routes
// //----------------------------------
const user = require("./routes/userRoute");
// //----------------------------------
// // This is Order Routes
// //----------------------------------
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const collector  = require("./routes/collectorRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);

app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1/",collector);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
