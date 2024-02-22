"use strict";
const {
  BadRequestError,
  UnauthorizedError,
} = require("../core/error.response");
const { asyncHandler } = require("../helper/asyncHandler");
const RedisService = require("../service/redis.service");

const HEADER = {
  API_KEY: "x-api-key",
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
  // verify access token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken || !accessToken?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  try {
    // check keyStore with user id
    const decodeUser = JWT.verify(
      accessToken.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET
    );
    // check refreshtoken in black list
    const blacklistRefresh = await RedisService.get(cookies.jwt);
    if (blacklistRefresh) {
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
