"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productOptionSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    selected: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductOption",
      },
    ],
  },
  {
    _id: false,
  }
);

const productSchema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    describe: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    options: {
      type: [productOptionSchema],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, productSchema);
