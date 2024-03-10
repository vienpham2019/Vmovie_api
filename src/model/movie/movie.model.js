"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const { RatingEnum, GenreEnum } = require("./movie.enum");

const DOCUMENT_NAME = "Movie";
const COLLECTION_NAME = "Movies";

// Declare the Schema of the Mongo model
const movieSchema = new Schema(
  {
    title: String,
    votes: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    rating: {
      type: String,
      enum: Object.values(RatingEnum),
    },
    runtime: String,
    releaseDate: String,
    genre: {
      type: String,
      enum: [Object.values(GenreEnum)],
    },
    movieDetail: String,
    cast: {
      type: [movieCast],
      default: [],
    },
    director: {
      type: [String],
      index: true,
    },
    studio: [String],
    producer: [String],
    writer: [String],
    posterUrl: String,
    photoUrls: {
      type: [String],
      default: [],
    },
    videoUrls: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const movieCast = new Schema(
  {
    name: String,
    url: String,
  },
  {
    _id: false,
  }
);

movieSchema.pre("save", function (next) {
  const requiredFields = [
    "title",
    "rating",
    "runtime",
    "releaseDate",
    "genre",
    "movieDetail",
    "cast",
    "posterUrl",
    "photoUrls",
    "videoUrls",
  ];

  if (this.isPublished) {
    // Check if any required fields are missing
    for (const field of requiredFields) {
      if (!this[field]) {
        return next(
          new Error(
            `The field '${field}' is required when the movie is published`
          )
        );
      }
    }
  }

  next();
});

//Export the model
module.exports = model(DOCUMENT_NAME, movieSchema);
