"use strict";
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const asyncHandler = require("../helper/asyncHandler");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "athorization",
  REFRESHTOKEN: "refreshtoken",
};

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

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid Request");
  }

  //
});

module.exports = { checkUserRole };
