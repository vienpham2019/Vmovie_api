"use strict";
const { Types } = require("mongoose");
const keyTokenModel = require("./keyToken.model");
const { createTokenCode } = require("../../util");
// Get
const getKeyTokenByUserId = async ({ userId }) => {
  return await keyTokenModel
    .findOne({ userId: new Types.ObjectId(userId) })
    .lean();
};
const getKeyTokenByRefreshToken = async ({ refreshToken }) => {
  return await keyTokenModel.findOne({ refreshToken }).lean();
};
// Create
const createKeyToken = async ({
  userId,
  refreshToken,
  refreshTokenSecret,
  accessTokenSecret,
}) => {
  const filter = { userId: new Types.ObjectId(userId) };
  const update = {
    accessTokenSecret,
    refreshTokenSecret,
  };
  const options = { upsert: true, new: true };
  return await keyTokenModel.findOneAndUpdate(filter, update, options);
};
// Update

// Delete
const deleteKeyTokenByUserId = async ({ userId }) => {
  return await keyTokenModel
    .deleteOne({ userId: new Types.ObjectId(userId) })
    .lean();
};
module.exports = {
  getKeyTokenByUserId,
  getKeyTokenByRefreshToken,
  createKeyToken,
  deleteKeyTokenByUserId,
};
