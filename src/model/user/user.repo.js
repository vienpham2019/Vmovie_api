"use strict";

const { getSelectData } = require("../../util");
const userModel = require("./user.model");

// Get
const getUserById = async ({ _id, select = [] }) => {
  return await userModel.findById(_id).select(getSelectData(select)).lean();
};

const getUserByEmail = async ({ user_email, select = [] }) => {
  return await userModel
    .findOne({ user_email })
    .select(getSelectData(select))
    .lean();
};
// Create
const createUser = async ({ payload }) => {
  return await userModel.create(payload);
};
// Update
// Delete

module.exports = { getUserById, getUserByEmail, createUser };
