"use strict";
const {
  BadRequestError,
  UnauthorizedError,
} = require("../core/error.response");
const { asyncHandler } = require("../helper/asyncHandler");
const { getKeyTokenByUserId } = require("../model/keyToken/keyToken.repo");

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
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    throw new UnauthorizedError();
  }
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedError();
  }

  // verify access token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken || !accessToken?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  try {
    const keyTokens = await getKeyTokenByUserId({ userId });
    if (!keyTokens) {
      throw new UnauthorizedError();
    }
    // check keyTokens with user id
    const decodeUser = JWT.verify(
      accessToken.split(" ")[1],
      keyTokens.refreshTokenSecret
    );
    if (userId != decodeUser.userId) {
      throw new UnauthorizedError();
    }
    // Ok all then return next
    req.user = decodeUser;
    req.refreshToken = cookies.jwt;
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = { checkUserRole, authentication };
