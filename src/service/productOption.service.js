"use strict";

const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const {
  createProductOption,
  deleteProductOptionById,
  getAllOptionTypes,
  getAllProductOptionsByType,
  getOptionByQuery,
  updateProductOption,
} = require("../model/productOption/productOption.repo");
const { removeUndefinedNull } = require("../util");

class ProductOptionService {
  // Get
  static async getAllOptionTypes() {
    try {
      return getAllOptionTypes();
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async getAllOptionsByType({ type }) {
    try {
      return getAllProductOptionsByType({
        type,
        select: ["_id", "name", "img", "optionType", "isParent"],
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  // Create
  static async createProductOption(payload) {
    try {
      const { optionType, name } = payload;
      const foundOption = await getOptionByQuery({
        query: { optionType, name },
      });
      if (foundOption) {
        throw new BadRequestError(`${name} already exists.`);
      }
      const unSelect = ["updatedAt", "createdAt", "__v"];
      return createProductOption({
        payload: removeUndefinedNull(payload),
        unSelect,
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async createProductSubOption(payload) {
    try {
      const unSelect = ["updatedAt", "createdAt", "__v"];
      return createProductOption({ payload, unSelect });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  // Update
  static async updateProductOption(payload) {
    try {
      const { optionType, name, img, _id } = payload;
      const foundOption = await getOptionByQuery({
        query: { optionType, name },
      });
      if (foundOption) {
        throw new BadRequestError(`${name} already exists.`);
      }
      const unSelect = ["updatedAt", "createdAt", "__v"];
      return updateProductOption({ _id, payload: { name, img }, unSelect });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  // Delete
  static async deleteProductOptionById({ _id }) {
    try {
      console.log(_id);
      return deleteProductOptionById({ _id });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}

module.exports = ProductOptionService;
