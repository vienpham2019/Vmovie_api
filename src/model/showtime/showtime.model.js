"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Showtime";
const COLLECTION_NAME = "Showtimes";

// Declare the Schema of the Mongo model
const showtimeSchema = new Schema(
  {
    theaterId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Theater",
    },
    movieId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Movie",
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    toJSON: { getters: true }, // Ensure getters are applied during toJSON
    toObject: { getters: true }, // Ensure getters are applied during toObject
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, showtimeSchema);
