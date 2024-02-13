"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "KeyToken";
const COLLECTION_NAME = "KeyTokens";
// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema(
  {
    keyToken_user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    keyToken_publicKey: {
      type: String,
      required: true,
    },
    keyToken_privateKey: {
      type: String,
      required: true,
    },
    keyToken_refreshTokensUsed: {
      type: Array,
      default: [],
    },
    keyToken_refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
