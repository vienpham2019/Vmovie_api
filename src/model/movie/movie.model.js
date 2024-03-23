"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const { RatingEnum, GenreEnum } = require("./movie.enum");

const DOCUMENT_NAME = "Movie";
const COLLECTION_NAME = "Movies";

const pictureSchema = new Schema(
  {
    mimeType: String,
    url: String,
    size: String,
    name: String,
  },
  {
    _id: false,
  }
);

const movieSchema = new Schema(
  {
    title: String,
    ratingScores: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    yearRelease: String,
    rating: {
      type: String,
      enum: Object.values(RatingEnum),
    },
    runtime: String,
    genre: {
      type: [String],
      enum: Object.values(GenreEnum),
    },
    country: [String],
    language: [String],
    movieDetail: String,
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: [String],
      index: true,
    },
    studio: [String],
    producer: [String],
    writer: [String],
    poster: pictureSchema,
    background: pictureSchema,
    photos: {
      type: [pictureSchema],
      default: [],
    },
    trailer: String,
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
    isCompleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    createBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
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
