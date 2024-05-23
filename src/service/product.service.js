"use strict";

const { getAllTypes, createProduct } = require("../model/product/product.repo");

class ProductService {
  // Get
  static async getAllTypes() {
    try {
      return getAllTypes();
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  // Create
  static async createProduct({ payload }) {
    try {
      return createProduct({ payload });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}

module.exports = ProductService;
