"use strict";
const {
  BadRequestError,
  UnauthorizedError,
} = require("../core/error.response");
const { asyncHandler } = require("../helper/asyncHandler");
const { getKeyTokenByUserId } = require("../model/keyToken/keyToken.repo");
const JWT = require("jsonwebtoken");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "athorization",
};

const checkUserRole = (role) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const validUserRole = req.user.roles.includes(role);
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
  const { cookies } = req;
  if (!cookies?.jwt) {
    throw new UnauthorizedError("No cookie");
  }

  const userId = cookies?.UserId;
  if (!userId) {
    throw new UnauthorizedError("No client id");
  }

  // verify access token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken?.startsWith("Bearer ")) {
    throw new UnauthorizedError("No access token");
  }

  try {
    const keyTokens = await getKeyTokenByUserId({ userId });
    if (!keyTokens) {
      throw new UnauthorizedError("not found key token");
    }
    // check keyTokens with user id
    const decodeUser = JWT.verify(
      accessToken.split(" ")[1],
      keyTokens.accessTokenSecret
    );
    if (userId != decodeUser.userId) {
      throw new UnauthorizedError("User id not match");
    }
    // Ok all then return next
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = { checkUserRole, authentication };
