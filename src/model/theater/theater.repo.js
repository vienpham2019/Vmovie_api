"use strict";

const { InternalServerError } = require("../../core/error.response");
const { getSelectData, getUnSelectData, getSkip } = require("../../util");
const theaterModel = require("./theater.model");

// Get
const getAllTheaters = async ({
  query,
  page,
  limit,
  sortBy,
  sortDir,
  select = [],
}) => {
  const totalTheaters = await theaterModel.countDocuments({
    ...query,
  });

  const theaters = await theaterModel
    .find({ ...query })
    .select(getSelectData(select))
    .sort({ [sortBy]: Math.floor(sortDir) })
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
// Create
const createTheater = async ({ payload }) => {
  try {
    return await theaterModel.create(payload);
  } catch (error) {
    throw new InternalServerError(error);
  }
};

// Update
// Delete

module.exports = { getAllTheaters, createTheater, findTheaterByName };
