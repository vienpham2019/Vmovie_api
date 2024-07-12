"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const { seatTypeEnum } = require("./theater.enum");

const DOCUMENT_NAME = "Theater";
const COLLECTION_NAME = "Theaters";

const validateSeatType = (val) => {
  const regex = new RegExp(`^\\d+(${Object.values(seatTypeEnum).join("|")})$`);
  return val.every((v) => regex.test(v));
};

// Declare the Schema of the Mongo model
const theaterSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      maxLength: 150,
    },
    grid: [
      {
        key: { type: String, required: true },
        value: {
          type: [String],
          default: [],
          validate: [validateSeatType, "Invalid seat type in grid value."],
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

Object.assign(theaterSchema.statics, { seatTypeEnum }); // Attach the enum to the schema statics

//Export the model
module.exports = model(DOCUMENT_NAME, theaterSchema);
