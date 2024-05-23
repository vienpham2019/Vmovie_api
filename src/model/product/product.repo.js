"use strict ";

const productModel = require("./product.model");

// Get
const getAllTypes = async () => {
  try {
    return await productModel.distinct("type");
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Create
const createProduct = async ({ payload }) => {
  try {
    return await productModel.create(payload);
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Update
// Delete
module.exports = {
  getAllTypes,
  createProduct,
};
