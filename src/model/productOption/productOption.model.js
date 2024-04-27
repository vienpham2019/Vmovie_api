"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "ProductOption";
const COLLECTION_NAME = "ProductOptions";

const productOptionSchema = new Schema(
  {
    optionType: {
      type: String,
      required: true,
    },
    name: String,
    img: String,
    isParent: {
      type: Boolean,
      default: true,
    },
    parentType: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, productOptionSchema);
