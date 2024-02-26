"use strict";

const { getSelectData, convertToObjectIdMongoDB } = require("../../util");
const { UserRoleEnum } = require("./user.enum");
const userModel = require("./user.model");

// Get
const getUserById = async ({ _id, select = [] }) => {
  return await userModel
    .findById(convertToObjectIdMongoDB(_id))
    .select(getSelectData(select))
    .lean()
    .exec();
};

const getUserByEmail = async ({ email, select = [] }) => {
  return await userModel
    .findOne({ email })
    .select(getSelectData(select))
    .lean()
    .exec();
};
// Create
const createUser = async ({ payload }) => {
  return await userModel.create(payload);
};
// Update
const updateUserById = async ({
  payload,
  _id,
  unSelect = ["createdAt", "updatedAt", "__v", "_id"],
}) => {
  const filter = { _id: convertToObjectIdMongoDB(_id) };
  const update = {
    $set: payload,
  };
  const options = { new: isNew };
  return await userModel
    .findOneAndUpdate(filter, update, options)
    .select(getSelectData(unSelect))
    .lean();
};
// Delete
const deleteUserById = async ({ _id }) => {
  return await userModel
    .findOneAndDelete({ _id: convertToObjectIdMongoDB(_id) })
    .lean();
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUserById,
  deleteUserById,
};
