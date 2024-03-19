"use strict";

const { convertToObjectIdMongoDB } = require("../../util");
const keyTokenModel = require("./keyToken.model");

//Get
const getKeyTokenByUserId = async ({ userId }) => {
  return await keyTokenModel
    .findOne({ userId: convertToObjectIdMongoDB(userId) })
    .lean();
};
//Create
const createOrUpdateKeyToken = async ({
  userId,
  refreshTokenSecret,
  accessTokenSecret,
}) => {
  const filter = { userId: convertToObjectIdMongoDB(userId) };
  const update = {
    refreshTokenSecret,
    accessTokenSecret,
    lastUpdatedAt: new Date(),
  };
  const options = { upsert: true, new: true };
  return await keyTokenModel.findOneAndUpdate(filter, update, options).lean();
};
//Update
//Delete
const deleteKeyTokenById = async (userId) => {
  return await keyTokenModel
    .deleteOne({
      userId: convertToObjectIdMongoDB(userId),
    })
    .lean();
};

module.exports = {
  getKeyTokenByUserId,
  createOrUpdateKeyToken,
  deleteKeyTokenById,
};
