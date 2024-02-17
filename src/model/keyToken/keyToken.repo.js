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
  return await keyTokenModel.findOne({ refreshToken: refreshToken }).lean();
};
// Create
const createKeyToken = async ({ userId, refreshToken }) => {
  const filter = { userId: new Types.ObjectId(userId) };
  const update = {
    publicKey: createTokenCode(),
    privateKey: createTokenCode(),
    refreshTokensUsed: [],
    refreshToken: refreshToken,
  };
  const options = { upsert: true, new: true };
  return await keytokenModel.findOneAndUpdate(filter, update, options);
};
// Update
const updateRefreshToken = async ({ token, newRefreshToken }) => {
  const filter = { _id: new Types.ObjectId(token._id) };
  const update = {
    $set: {
      refreshToken: newRefreshToken,
    },
    $addToSet: {
      refreshTokensUsed: token.refreshToken,
    },
  };
  return await keytokenModel.updateMany(filter, update).lean();
};
// Delete

module.exports = {
  getKeyTokenByUserId,
  getKeyTokenByRefreshToken,
  createKeyToken,
  updateRefreshToken,
};
