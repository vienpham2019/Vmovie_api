"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const { seatTypeEnum } = require("./theater.enum");

const DOCUMENT_NAME = "Theater";
const COLLECTION_NAME = "Theaters";

// Declare the Schema of the Mongo model
const theaterSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      maxLength: 150,
    },
    grid: [[{ type: String, enum: Object.values(seatTypeEnum) }]],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, theaterSchema);
