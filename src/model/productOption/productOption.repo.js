"use strict";

const { InternalServerError } = require("../../core/error.response");
const { getSelectData, getUnSelectData } = require("../../util");
const productOptionModel = require("./productOption.model");

// Get
const getOptionByQuery = async ({ query }) => {
  try {
    return await productOptionModel.findOne(query).lean().exec();
  } catch (error) {
    throw new InternalServerError(error);
  }
};
const getAllProductOptionsByType = async ({ type, select = [] }) => {
  try {
    return await productOptionModel
      .find({
        optionType: type,
      })
      .select(getSelectData(select))
      .lean()
      .exec();
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const getAllOptionTypes = async () => {
  try {
    return await productOptionModel.distinct("optionType", { isParent: true });
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const getAllSubOptionTypes = async () => {
  try {
    return await productOptionModel.find(
      { isParent: false }, // Filter criteria
      getSelectData(["optionType", "parentType"]) // Projection
    );
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const checkOptionTypeExists = async (optionType) => {
  try {
    const existingOption = await productOptionModel.findOne({ optionType });
    return !!existingOption;
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Create
const createProductOption = async ({ payload }) => {
  try {
    return await productOptionModel.create(payload);
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Update
const updateProductOption = async ({ _id, payload, unSelect = [] }) => {
  try {
    return await productOptionModel
      .findByIdAndUpdate({ _id }, payload, { new: true })
      .select(getUnSelectData(unSelect))
      .lean();
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Delete
const deleteProductOptionById = async ({ _id }) => {
  try {
    return await productOptionModel.findByIdAndDelete(_id);
  } catch (error) {
    throw new InternalServerError(error);
  }
};

module.exports = {
  checkOptionTypeExists,
  getOptionByQuery,
  getAllSubOptionTypes,
  getAllProductOptionsByType,
  getAllOptionTypes,
  createProductOption,
  updateProductOption,
  deleteProductOptionById,
};
