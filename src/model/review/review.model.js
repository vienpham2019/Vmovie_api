"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const { TypeEnum } = require("./review.enum");

const DOCUMENT_NAME = "Review";
const COLLECTION_NAME = "Reviews";

const reviewSchema = new Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
    },
    date: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
      step: 1,
    },
    type: {
      type: String,
      enum: Object.values(TypeEnum),
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorCop: String,
    reviewContent: {
      type: String,
      required: true,
    },
    fullReviewLink: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, reviewSchema);
