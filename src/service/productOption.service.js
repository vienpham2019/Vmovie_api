"use strict";

const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const cloudBucket = require("../db/init.googleCloud");
const {
  createProductOption,
  deleteProductOptionById,
  getAllOptionTypes,
  getAllProductOptionsByType,
  getOptionByQuery,
  updateProductOption,
  getAllSubOptionTypes,
} = require("../model/productOption/productOption.repo");
const { removeUndefinedNull } = require("../util");

class ProductOptionService {
  // Get
  static async getAllOptionTypes() {
    try {
      const types = await getAllOptionTypes();
      const subTypes = await getAllSubOptionTypes();
      const result = [...types];
      subTypes.forEach(({ optionType, parentType }) => {
        if (!result.includes(parentType)) {
          result.push(parentType);
        }
        if (!result.includes(`${parentType}_${optionType}`)) {
          result.push(`${parentType}_${optionType}`);
        }
      });
      return result;
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

      if (foundOption?.img && foundOption.img !== payload?.img) {
        await this.deleteImageByFileName({
          fileName: foundOption.img.split("/").slice(-1)[0],
        });
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
      const foundOption = await getOptionByQuery({
        query: { _id },
      });

      if (foundOption?.img) {
        await this.deleteImageByFileName({
          fileName: foundOption.img.split("/").slice(-1)[0],
        });
      }

      deleteProductOptionById({ _id });
      return;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async deleteAllOptionByType({ type }) {
    try {
      const foundOptions = await getAllProductOptionsByType({
        type,
      });
      await Promise.all(
        foundOptions.map(async (option) => {
          if (option?.img) {
            await this.deleteImageByFileName({
              fileName: option.img.split("/").slice(-1)[0],
            });
          }
          await deleteProductOptionById({ _id: option._id });
        })
      );

      return;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async deleteImageByFileName({ fileName }) {
    const file = cloudBucket.file(fileName);
    const [exists] = await file.exists();
    if (exists) await file.delete();
  }
}

module.exports = ProductOptionService;
