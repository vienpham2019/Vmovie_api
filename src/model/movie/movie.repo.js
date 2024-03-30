"use strict";

const {
  convertToObjectIdMongoDB,
  getUnSelectData,
  getSelectData,
  getSkip,
} = require("../../util");
const movieModel = require("./movie.model");

// Get
const getAllMovies = async ({ page, limit, select = [] }) => {
  return await movieModel
    .find({ isCompleted: true })
    .select(getSelectData(select))
    .sort({ updatedAt: -1 })
    .skip(getSkip({ page, limit }))
    .limit(limit)
    .lean()
    .exec();
};

const getMovieById = async ({ movieId, unSelect = [] }) => {
  return await movieModel
    .findOne({ _id: convertToObjectIdMongoDB(movieId) })
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

module.exports = {
  getAllMovies,
  getUncompletedMovie,
  getMovieById,
  createMovieByUserId,
  updateMovieByMovieId,
  addMoviePhotos,
  removeMoviePhotos,
};
