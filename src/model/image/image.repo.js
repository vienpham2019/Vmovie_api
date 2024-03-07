"use strict";

const imageModel = require("./image.model");

// Get
// Create
const createImage = async ({ payload }) => {
  return await imageModel.create(payload);
};
// Update
// Delete

module.exports = {
  createImage,
};
