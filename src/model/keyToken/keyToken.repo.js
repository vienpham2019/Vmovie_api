"use strict";
const { Types } = require("mongoose");
const keyTokenModel = require("./keyToken.model");
// Get
const findKeyTokenByUserId = async ({ userId }) => {
  return await keyTokenModel
    .findOne({ keyToken_user: new Types.ObjectId(userId) })
    .lean();
};
// Create
// Update
// Delete

module.exports = { findKeyTokenByUserId };
