"use strict";

const {
  convertToObjectIdMongoDB,
  getUnSelectData,
  getSelectData,
  getSkip,
} = require("../../util");
const movieModel = require("./movie.model");

// Get
const getTotalMovies = async () => {
  return await movieModel.countDocuments();
};
const getAllMovies = async ({
  query,
  page,
  limit,
  sortBy,
  sortDir,
  select = [],
}) => {
  const totalMovies = await movieModel.countDocuments({
    isCompleted: true,
    ...query,
  });

  const movies = await movieModel
    .find({ isCompleted: true, ...query })
    .select(getSelectData(select))
    .sort({ [sortBy]: Math.floor(sortDir) })
    .skip(getSkip({ page, limit }))
    .limit(limit)
    .lean()
    .exec();

  return {
    totalMovies,
    movies,
  };
};

const getMovieById = async ({ movieId, unSelect = [] }) => {
  return await movieModel
    .findOne({ _id: convertToObjectIdMongoDB(movieId) })
    .select(getUnSelectData(unSelect))
    .lean()
    .exec();
};

const getPublicMovieById = async ({ movieId, unSelect = [] }) => {
  return await movieModel
    .findOne({ _id: convertToObjectIdMongoDB(movieId), isPublished: true })
    .select(getUnSelectData(unSelect))
    .lean()
    .exec();
};

const getUncompletedMovie = async ({ userId, unSelect = [] }) => {
  const filter = {
    createBy: convertToObjectIdMongoDB(userId),
    isCompleted: false,
  };
  return await movieModel
    .findOne(filter)
    .select(getUnSelectData(unSelect))
    .lean()
    .exec();
};
// Create
const createMovieByUserId = async ({ userId, unSelect = [] }) => {
  const payload = {
    createBy: convertToObjectIdMongoDB(userId),
  };
  return await movieModel
    .create(payload)
    .select(getUnSelectData(unSelect))
    .lean()
    .exec();
};

// Update
const addMoviePhotos = async ({ movieId, photo }) => {
  const filter = {
    _id: convertToObjectIdMongoDB(movieId),
  };
  const update = {
    $push: {
      photos: photo,
    },
  };
  const options = { new: true };
  return await movieModel.findOneAndUpdate(filter, update, options).lean();
};

const removeMoviePhotos = async ({ movieId, fileName }) => {
  const filter = {
    _id: convertToObjectIdMongoDB(movieId),
  };
  const update = {
    $pull: {
      photos: { name: fileName },
    },
  };
  const options = { new: true };
  return await movieModel.findOneAndUpdate(filter, update, options).lean();
};

const updateMovieByMovieId = async ({ movieId, payload, unSelect = [] }) => {
  const filter = {
    _id: convertToObjectIdMongoDB(movieId),
  };
  const options = { new: true };
  return await movieModel
    .findOneAndUpdate(filter, payload, options)
    .select(getUnSelectData(unSelect))
    .lean();
};
// Delete

const deleteMovieById = async ({ movieId }) => {
  return await movieModel.deleteOne({ _id: convertToObjectIdMongoDB(movieId) });
};

module.exports = {
  getTotalMovies,
  getAllMovies,
  getUncompletedMovie,
  getMovieById,
  getPublicMovieById,
  createMovieByUserId,
  updateMovieByMovieId,
  addMoviePhotos,
  removeMoviePhotos,
  deleteMovieById,
};
