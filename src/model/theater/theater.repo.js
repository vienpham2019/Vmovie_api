"use strict";

const { InternalServerError } = require("../../core/error.response");
const {
  getSelectData,
  getUnSelectData,
  getSkip,
  convertToObjectIdMongoDB,
} = require("../../util");
const theaterModel = require("./theater.model");

// Get
const getTheaterDetails = async ({ _id, unSelect }) => {
  try {
    return await theaterModel
      .findById(convertToObjectIdMongoDB(_id))
      .select(getUnSelectData(unSelect))
      .lean()
      .exec();
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const getAllTheaters = async ({ query, page, limit, select = [] }) => {
  const totalTheaters = await theaterModel.countDocuments({
    ...query,
  });

  const theaters = await theaterModel
    .find({ ...query })
    .select(getSelectData(select))
    .skip(getSkip({ page, limit }))
    .limit(limit)
    .lean()
    .exec();

  return {
    totalTheaters,
    theaters,
  };
};

const findTheaterByName = async (name) => {
  try {
    return await theaterModel.findOne({ name });
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const findTheaterById = async (_id) => {
  try {
    return await theaterModel.findById(_id);
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Create
const createTheater = async ({ payload }) => {
  try {
    return await theaterModel.create(payload);
  } catch (error) {
    throw new InternalServerError(error);
  }
};

// Update
const updateTheater = async ({ payload, _id, unSelect = [] }) => {
  try {
    return await theaterModel
      .findOneAndUpdate({ _id: convertToObjectIdMongoDB(_id) }, payload)
      .select(getUnSelectData(unSelect))
      .lean();
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Delete
const deleteTheaterById = async ({ _id }) => {
  try {
    return await theaterModel.findByIdAndDelete(_id);
  } catch (error) {
    throw new InternalServerError(error);
  }
};

module.exports = {
  getTheaterDetails,
  getAllTheaters,
  createTheater,
  updateTheater,
  findTheaterByName,
  deleteTheaterById,
  findTheaterById,
};
