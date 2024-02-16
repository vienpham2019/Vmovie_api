"use strict";

const { getSelectData } = require("../../util");
const { UserRoleEnum } = require("./user.enum");
const userModel = require("./user.model");

// Get
const getUserById = async ({ _id, select = [] }) => {
  return await userModel
    .findById(_id)
    .select(getSelectData(select))
    .lean()
    .exec();
};

const getUserByEmail = async ({ user_email, select = [] }) => {
  return await userModel
    .findOne({ user_email })
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
  const filter = { _id };
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
  return await userModel.findOneAndDelete({ _id }).lean();
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUserById,
  deleteUserById,
};
