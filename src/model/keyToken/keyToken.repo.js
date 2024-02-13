"use strict";
const { Types } = require("mongoose");
const keyTokenModel = require("./keyToken.model");
// Get
const getKeyTokenByUserId = async ({ userId }) => {
  return await keyTokenModel
    .findOne({ keyToken_userId: new Types.ObjectId(userId) })
    .lean();
};
const getKeyTokenByRefreshToken = async ({ refreshToken }) => {
  return await keyTokenModel
    .findOne({ keyToken_refreshToken: refreshToken })
    .lean();
};
// Create
const createKeyToken = async ({
  userId,
  publicKey,
  privateKey,
  refreshToken,
}) => {
  const filter = { keyToken_userId: new Types.ObjectId(userId) };
  const update = {
    keyToken_publicKey: publicKey,
    keyToken_privateKey: privateKey,
    keyToken_refreshTokensUsed: [],
    keyToken_refreshToken: refreshToken,
  };
  const options = { upsert: true, new: true };
  return await keytokenModel.findOneAndUpdate(filter, update, options);
};
// Update
const updateRefreshToken = async ({ token, newRefreshToken }) => {
  const filter = { _id: new Types.ObjectId(token._id) };
  const update = {
    $set: {
      keyToken_refreshToken: newRefreshToken,
    },
    $addToSet: {
      keyToken_refreshTokensUsed: token.refreshToken,
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
