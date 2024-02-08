"use strict";
const { BadRequestError } = require("../core/error.response");
const asyncHandler = require("../helper/asyncHandler");

const checkUserRole = (role) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const foundUser = await getUserById({ userId: req.user.userId });
      const validUserRole = foundUser.user_roles.includes(role);
      if (!validUserRole) {
        throw new BadRequestError("Request denied");
      }
      return next();
    } catch (error) {
      throw error;
    }
  });
};

module.exports = { checkUserRole };
