"use strict";

const {
  BadRequestError,
  InternalServerError,
} = require("../core/error.response");
const {
  getAllTypes,
  createProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  deleteProductById,
  getAllProdyctByType,
} = require("../model/product/product.repo");

class ProductService {
  // Get
  static async getAllTypes() {
    try {
      return getAllTypes();
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async getProductDetails({ _id }) {
    try {
      return getProductDetails({
        _id,
        unSelect: ["updatedAt", "createdAt", "__v", "_id"],
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async getAllProductByType({ type }) {
    try {
      return getAllProdyctByType({
        type,
        select: ["_id", "itemName", "price", "imgUrl"],
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async getAllProductByAdmin({
    limit = 50,
    page = 1,
    sortBy = "updatedAt",
    filter = "All",
    search = "",
    sortDir = 1,
  }) {
    const regex = new RegExp(search, "i"); // "i" flag for case-insensitive matching
    const query = {
      itemName: { $regex: regex },
    };

    if (filter !== "All") {
      query["type"] = filter;
    }

    try {
      return await getAllProducts({
        query,
        page,
        limit,
        sortBy,
        sortDir,
        select: [
          "_id",
          "updatedAt",
          "createdAt",
          "itemName",
          "price",
          "type",
          "imgUrl",
        ],
      });
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

  // Update
  static async updateProduct({ payload, _id }) {
    try {
      const foundProduct = await getProductDetails({ _id });
      if (!foundProduct) {
        throw new BadRequestError("Product not found");
      }
      return updateProduct({ _id, payload });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  // Delete
  static async deleteProductById({ _id }) {
    try {
      const foundProduct = await getProductDetails({ _id });
      if (!foundProduct) {
        throw new BadRequestError("Product not found");
      }
      return await deleteProductById({ _id });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}

module.exports = ProductService;
