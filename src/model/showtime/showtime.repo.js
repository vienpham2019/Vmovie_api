"use strict";

const { InternalServerError } = require("../../core/error.response");
const { getUnSelectData, convertToObjectIdMongoDB } = require("../../util");
const showtimeModel = require("./showtime.model");

// Get
const getAllShowTimeByQuery = async ({ query, unSelect }) => {
  try {
    return await showtimeModel
      .find(query)
      .populate({
        path: "theaterId",
        select: "name",
      })
      .populate({
        path: "movieId",
        select: "title runtime poster",
      })
      .select(getUnSelectData(unSelect))
      .lean()
      .exec();
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const getShowTimeById = async ({ _id, unSelect }) => {
  try {
    return await showtimeModel
      .findById(_id)
      .populate({
        path: "theaterId",
        select: "name",
      })
      .populate({
        path: "movieId",
        select: "title runtime poster",
      })
      .select(getUnSelectData(unSelect))
      .lean()
      .exec();
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Create
const createShowtime = async ({ payload }) => {
  try {
    return await showtimeModel.create(payload);
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Update
// Delete
const deleteShowtime = async ({ _id }) => {
  console.log(_id);
  try {
    return await showtimeModel.findOneAndDelete({
      _id: convertToObjectIdMongoDB(_id),
    });
  } catch (error) {
    throw new InternalServerError(error);
  }
};

module.exports = {
  getAllShowTimeByQuery,
  createShowtime,
  getShowTimeById,
  deleteShowtime,
};
