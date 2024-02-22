const express = require("express");
const app = express();

const compression = require("compression");
const { default: helmet } = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/allowedOrigins");

// init middlewares
app.use(express.json());
// morgan: Logs HTTP requests to the console, providing information such as request method, URL, status code,
// and response time. Useful for debugging and monitoring.
app.use(cors(corsOptions));
app.use(morgan("dev"));
// mongoSantitize againt NoSQL query injection
app.use(mongoSanitize());
// xss againt HTML tag injection
app.use(xss());
//helmet: Sets various HTTP headers to improve security, including headers like Content Security Policy (CSP),
//Strict-Transport-Security, X-Frame-Options, and more.
app.use(helmet());
//compression middleware helps reduce the size of the response data
app.use(compression());
//express.json() : Parses incoming JSON requests, making the JSON data available in req.body for easy access
//in your route handlers.
app.use(express.json());
//Parses incoming URL-encoded form data, making it available in req.body for easy access in your route handlers.
app.use(
  express.urlencoded({
    extended: true,
  })
);
//Parses cookies attached to incoming requests, making them available in req.cookies for easy access in your route handlers.
app.use(cookieParser());

// init db
require("./db/init.mongodb");

// init routes
app.use("/v1/api", require("./route"));
// handle error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusError = error.status || 500;
  return res.status(statusError).json({
    status: "error",
    code: statusError,
    stack: error.stack, // only for dev enviroment
    message: error.message || "Internal Server Errror",
  });
});

module.exports = app;
