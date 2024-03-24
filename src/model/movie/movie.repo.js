"use strict";

const { convertToObjectIdMongoDB, getUnSelectData } = require("../../util");
const movieModel = require("./movie.model");

// Get
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
const addMoviePhotos = async ({ userId, photo }) => {
  const filter = {
    createBy: convertToObjectIdMongoDB(userId),
    isCompleted: false,
  };
  const update = {
    $push: {
      photos: photo,
    },
  };
  const options = { new: true };
  return await movieModel.findOneAndUpdate(filter, update, options).lean();
};

const removeMoviePhotos = async ({ userId, fileName }) => {
  const filter = {
    createBy: convertToObjectIdMongoDB(userId),
    isCompleted: false,
  };
  const update = {
    $pull: {
      photos: { name: fileName },
    },
  };
  const options = { new: true };
  return await movieModel.findOneAndUpdate(filter, update, options).lean();
};

const updateMovieByUserId = async ({ userId, payload, unSelect = [] }) => {
  const filter = {
    createBy: convertToObjectIdMongoDB(userId),
    isCompleted: false,
  };
  const options = { new: true };
  return await movieModel
    .findOneAndUpdate(filter, payload, options)
    .select(getUnSelectData(unSelect))
    .lean();
};
// Delete

module.exports = {
  getUncompletedMovie,
  createMovieByUserId,
  updateMovieByUserId,
  addMoviePhotos,
  removeMoviePhotos,
};
