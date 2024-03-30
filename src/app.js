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

const fs = require("fs");
const { GenreEnum, RatingEnum } = require("./model/movie/movie.enum");
const { convertToObjectIdMongoDB } = require("./util");
const movieModel = require("./model/movie/movie.model");
const { v4: uuidv4 } = require("uuid");
fs.readFile("db.json", "utf8", async (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Parse the JSON dat
  try {
    const jsonData = JSON.parse(data);

    // Loop through the contents of the JSON object
    for (let i = 0; i < 4; i++) {
      const movie = jsonData["movies"][i];
      const {
        title,
        poster_path,
        backdrop_path,
        overview,
        release_date,
        Runtime,
        Writer,
        Country,
        Actors,
        Director,
        Language,
        Awards,
        videos,
      } = movie;

      const movieObject = {
        title: title || "Unknown Title",
        poster: {
          url: poster_path || "",
          mimeType:
            "image/" + poster_path.substring(poster_path.lastIndexOf(".") + 1),
          size: "N/A",
          name: uuidv4(),
        },
        thumbnail: {
          url: backdrop_path || "",
          mimeType:
            "image/" +
            backdrop_path.substring(backdrop_path.lastIndexOf(".") + 1),
          size: "N/A",
          name: uuidv4(),
        },
        movieDetail: overview || "No description available",
        dateRelease: release_date || "Unknown Release Date",
        runtime: Runtime || "Unknown Runtime",
        rating: RatingEnum.NC_17,
        genre: [GenreEnum.ACTION],
        writer: Writer
          ? Writer.split(",").map((writer) => writer.trim())
          : ["Unknown Writer"],
        country: Country
          ? Country.split(",").map((country) => country.trim())
          : ["Unknown Country"],
        cast: Actors
          ? Actors.split(",").map((actor) => actor.trim())
          : ["Unknown Actor"],
        director: Director
          ? Director.split(",").map((director) => director.trim())
          : ["Unknown Director"],
        language: Language
          ? Language.split(",").map((language) => language.trim())
          : ["Unknown Language"],
        awards: Awards || "N/A",
        trailer: videos.length > 0 ? videos[0]["videoUrl"] : "",
        isCompleted: true, // Assuming default value for isCompleted
        createBy: convertToObjectIdMongoDB("65f87875325f4b9b8b038132"),
      };
      // await movieModel.create(movieObject);
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});

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
