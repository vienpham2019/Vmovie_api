"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const { daysToSeconds, minsToSeconds } = require("../../util");

const DOCUMENT_NAME = "KeyToken";
const COLLECTION_NAME = "KeyTokens";

// Declare the Schema of the Mongo model
const keytokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    refreshTokenSecret: {
      type: String,
      required: true,
    },
    accessTokenSecret: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// keytokenSchema.index(
//   { updatedAt: 1 },
//   { expireAfterSeconds: minsToSeconds(15) }
// );

//Export the model
module.exports = model(DOCUMENT_NAME, keytokenSchema);
